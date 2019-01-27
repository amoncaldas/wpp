import Single from './Single'
import wppRouter from '@/support/wpp-router'
import store from '@/store/store'
import Section from '@/support/section'

const routes = {
  get: () => {
    let routes = []
    var regex = new RegExp('/', 'g')

    let postTypeEndpoints = wppRouter.getPostTypeEndpoints()
    postTypeEndpoints.forEach(postTypeEndpoint => {
      let postTypeEndpointUrl = postTypeEndpoint.url.replace(regex, '')
      routes.push(
        {
          path: `/${postTypeEndpointUrl}/:postName/:postId`,
          name: `${postTypeEndpointUrl}-Single`,
          component: Single,
          beforeEnter: (to, from, next) => {
            let curretHomeSection = Section.getCurrentHomeSection()
            store.commit('currentSection', curretHomeSection)
            store.commit('postTypeEndpoint', postTypeEndpoint.endpoint)
            next()
          }
        }
      )
      routes.push(
        {
          path: `/${postTypeEndpointUrl}/:postId`,
          name: `${postTypeEndpointUrl}-SingleId`,
          component: Single,
          beforeEnter: (to, from, next) => {
            let curretHomeSection = Section.getCurrentHomeSection()
            store.commit('currentSection', curretHomeSection)
            store.commit('postTypeEndpoint', postTypeEndpoint.endpoint)
            next()
          }
        }
      )
      let sections = wppRouter.getSections(false)
      sections.forEach(section => {
        let sectionEndPoint = section.link.replace(regex, '')
        routes.push(
          {
            path: `/${sectionEndPoint}/${postTypeEndpointUrl}/:postName/:postId`,
            name: `${sectionEndPoint}-${postTypeEndpointUrl}-Single`,
            component: Single,
            beforeEnter: (to, from, next) => {
              store.commit('currentSection', section)
              store.commit('postTypeEndpoint', postTypeEndpoint.endpoint)
              next()
            }
          }
        )
        routes.push(
          {
            path: `/${sectionEndPoint}/${postTypeEndpointUrl}/:postId`,
            name: `${sectionEndPoint}-${postTypeEndpointUrl}-SingleId`,
            component: Single,
            beforeEnter: (to, from, next) => {
              store.commit('currentSection', section)
              store.commit('postTypeEndpoint', postTypeEndpoint.endpoint)
              next()
            }
          }
        )
      })
    })
    return routes
  }
}

const singleRoutes = routes.get()

export default singleRoutes
