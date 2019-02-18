import store from '@/store/store'
import Main from '@/main'

const section = {
  getListingPosts () {
    let listPostEndpoints = []
    let currentSection = section.getCurrentSection()
    let VueInstance = Main.getInstance()

    if (Array.isArray(currentSection.acf.list_post_endpoints)) {
      let translations = store.getters.options.post_type_translations

      currentSection.acf.list_post_endpoints.forEach(endpoint => {
        let localesTranslation = VueInstance.lodash.find(translations, (locales) => {
          return VueInstance.lodash.find(locales, locale => {
            return locale.path === endpoint
          })
        })
        if (localesTranslation) {
          let translation = localesTranslation[store.getters.locale]
          listPostEndpoints.push({endpoint: endpoint, title: translation.title})
        }
      })
    }
    return listPostEndpoints
  },
  getCurrentSection () {
    if (store.getters.currentSection) {
      return store.getters.currentSection
    } else {
      let VueInstance = Main.getInstance()
      let currentSection = VueInstance.lodash.find(store.getters.sections, (section) => {
        return section.link === VueInstance.$route.path && section.locale === store.getters.locale
      })
      return currentSection
    }
  },
  getCurrentHomeSection () {
    let VueInstance = Main.getInstance()
    let currentHomeSection = VueInstance.lodash.find(store.getters.sections, (section) => {
      return section.link === '/' && section.locale === store.getters.locale
    })
    return currentHomeSection
  }
}

export default section
