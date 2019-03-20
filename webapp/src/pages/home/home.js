import SectionsMap from '@/fragments/sections-map/SectionsMap'
import PostMap from '@/fragments/post-map/PostMap'
import Posts from '@/fragments/posts/Posts'
import Slider from '@/fragments/slider/Slider'
import Section from '@/support/section'

export default {
  data: () => ({
    valid: false,
    listingPosts: [],
    compactListingPosts: [],
    currentSection: null
  }),
  components: {
    SectionsMap,
    Posts,
    Slider,
    PostMap
  },
  created () {
    // emit the an event catch by root App component
    // telling it to update the page title
    this.eventBus.$emit('titleChanged', this.$store.getters.options.site_title)
    this.loadData()
    this.eventBus.$on('localeChanged', () => {
      this.loadData()
    })
  },
  methods: {
    loadData () {
      this.currentSection = Section.getCurrentHomeSection()
      this.$store.commit('currentSection', this.currentSection)
      this.listingPosts = Section.getListingPosts()
      this.compactListingPosts = Section.getCompactListingPosts()
      this.eventBus.$emit('setLocaleFromContentLocale', this.currentSection.locale)
    }
  },
  computed: {
    max () {
      let max = this.currentSection.extra.max_listing_posts !== undefined ? this.currentSection.extra.max_listing_posts : 4
      return Number(max)
    },

    maxCompact () {
      let max = this.currentSection.extra.max_compact_listing_posts !== undefined ? this.currentSection.extra.max_compact_listing_posts : 4
      return Number(max)
    }
  }
}
