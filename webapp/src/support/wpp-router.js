import store from '@/store/store'
import appConfig from '@/config'
import utils from '@/support/utils'

const wppRouter = {
  getSectionEndpoints: () => {
    let sectionsRoutes = store.getters.sectionsRoutes
    return sectionsRoutes || []
  },
  getSections: (includeHomes = true) => {
    let sections
    if (includeHomes) {
      sections = store.getters.sections
    } else {
      sections = []
      store.getters.sections.forEach(section => {
        if (section.link !== '/') {
          sections.push(section)
        }
      })
    }
    return sections || []
  },
  getPostTypeEndpoints: () => {
    let endpoints = []
    if (store.getters.options.post_type_endpoints) {
      endpoints = store.getters.options.post_type_endpoints

      for (let key in endpoints) {
        if (typeof endpoints[key] === 'string') {
          let declaredEndpoint = endpoints[key].trim()
          wppRouter.addEndpointTranslations(declaredEndpoint, endpoints)
          endpoints[key] = {endpoint: declaredEndpoint, path: declaredEndpoint}
        }
      }
    }
    return endpoints
  },
  addEndpointTranslations: (endpoint, endpoints) => {
    let translations = store.getters.options.post_type_translations
    if (translations) {
      for (let tKey in translations) {
        let translation = translations[tKey]

        let hasTranslation = wppRouter.endPointHasTranslations(endpoint, translation)
        if (hasTranslation) {
          for (let key in translation) {
            let locale = translation[key]
            let includes = endpoints.includes(locale.path)
            if (!includes) {
              endpoints.push({endpoint: endpoint, path: locale.path})
            }
          }
        }
      }
    }
    return endpoints
  },

  endPointHasTranslations: (endpoint, translation) => {
    let match = false
    for (let key in translation) {
      let locale = translation[key]
      if (locale.path === endpoint) {
        match = true
      }
    }
    return match
  },

  resolveDependencies: () => {
    return new Promise((resolve) => {
      let promise1 = store.dispatch('fetchSections')
      let promise2 = null
      store.dispatch('fetchOptions').then(() => {
        appConfig.defaultLocale = store.getters.options.defaultLocale
        appConfig.validLocales = store.getters.options.locales
        promise2 = store.dispatch('autoSetLocale')
        Promise.all([promise1, promise2]).then((data) => {
          // Redirect to the correct locale url if
          // the autoLocale is different from the one in the html
          // and the url is '/'
          let queryParams = utils.getUrlParams()
          let autoLoadedLocale = data[1]
          if (!queryParams.l && autoLoadedLocale !== appConfig.defaultLocale && window.location.pathname === '/') {
            window.location.href = `/?l=${autoLoadedLocale}`
          }
          resolve(data)
        })
      })
    })
  }
}

export default wppRouter
