import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import loader from '@/support/loader'
import socialAuth from '@/common/social-auth'
import VueInstance from '@/main'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  // Initially the routes ARRAY is declared only with
  // the root/abstract route. It is gonna be populated below.
  // The route `/` will be matched whenever the app loads any route
  // because it is an abstract route, so every route contains the base `/` route
  routes: [ {
    path: '/',
    name: 'Root',
    beforeEnter: (to, from, next) => {
      // Get current route
      // this only works in we are using the `hash` mode
      let route = location.hash.replace('#', '')

      // If the current route is the root `/` page
      // send the user to the home page
      // the `/home` route guard will check if the user is not logged in
      // if s/he is not, it will redirect the user to the `/login` page
      if (route === '/') {
        // if we are dealing with a oauth callback request,
        // we will run the the oauth routine and receive
        // a boolean if the flow most continue or not.
        let proceed = socialAuth.runOauthCallBackCheck()
        if (proceed) {
          next('/home')
        }
      } else {
        // if the target is not the root `/` page
        // send the user to the target page
        next(route)
      }
    }
  }]
})

/**
 * We have to load the menu before entering in each route
 */
router.beforeEach((to, from, next) => {
  let promise1 = store.dispatch('tryAutoLogin')
  let promise2 = store.dispatch('fetchSections')
  let promise3 = store.dispatch('fetchOptions')

  Promise.all([promise1, promise2, promise3]).then(() => {
    next()
  })
})

router.afterEach((to, from) => {
  VueInstance.eventBus.$emit('routeChanged', {to: to, from: from})
})

// load and get all routes from components with name following the pattern *.route.js
let routes = loader.load(require.context('@/pages/', true, /\.route\.js$/))

// Once we have all additional routes, we add them to the router
router.addRoutes(routes)

export default router
