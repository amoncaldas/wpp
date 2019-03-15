import PostMap from '@/fragments/post-map/PostMap'
import Posts from '@/fragments/posts/Posts'
import Slider from '@/fragments/slider/Slider'
import Section from '@/support/section'

export default {
  data: () => ({
    valid: false,
    homePosTypes: [],
    currentSection: null
  }),
  components: {
    PostMap,
    Posts,
    Slider
  },
  computed: {
    listingPosts () {
      return this.homePostTypes
    }
  },
  created () {
    this.currentSection = Section.getCurrentSection()
    this.homePostTypes = Section.getListingPosts()

    // Emit the an event catch by root App component
    // telling it to update the page title
    this.eventBus.$emit('titleChanged', this.$store.getters.options.site_title)
  },
  methods: {
  }
}
