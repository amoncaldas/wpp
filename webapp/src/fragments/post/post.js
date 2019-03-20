import postService from '@/shared-services/post-service'
import Media from '@/fragments/media/Media'
import PostMap from '@/fragments/post-map/PostMap'
import Gallery from '@/fragments/gallery/Gallery'
import Comments from '@/fragments/comments/Comments'
import utils from '@/support/utils'
import Author from './components/author/Author'
import Sharer from '@/fragments/sharer/Sharer'

export default {
  name: 'post',
  created () {
    this.renderAsPage = this.isPage
    let pageTypes = this.$store.getters.options.page_like_types
    pageTypes = Array.isArray(pageTypes) ? pageTypes : [pageTypes]

    if (pageTypes.includes(this.$store.getters.postTypeEndpoint)) {
      this.renderAsPage = true
    }
    this.post = this.postData
  },
  props: {
    isPage: {
      default: false
    },
    postData: {
      required: true
    },
    noTopBorder: {
      default: false
    },
    mode: {
      type: String,
      default: 'block' // compact, list, single, block
    },
    explicitLocale: {
      type: Boolean,
      default: false
    },
    showType: {
      default: false
    }
  },
  data () {
    return {
      post: null,
      galleryImageIndex: null,
      renderAsPage: false
    }
  },
  computed: {
    featuredMedia () {
      if (this.post._embedded && this.post._embedded['wp:featuredmedia']) {
        let media = this.post._embedded['wp:featuredmedia'][0]
        return media
      }
    },
    hasPlaces () {
      return this.post.places && Object.keys(this.post.places).length > 0
    },
    related () {
      if (this.post && this.post.extra && this.post.extra.related && Array.isArray(this.post.extra.related)) {
        return this.post.extra.related
      }
      return []
    },
    title () {
      if (this.post.title.rendered) {
        return this.post.title.rendered
      }
      return this.post.title
    },
    excerpt () {
      let maxLength = this.mode === 'compact' ? 150 : 300
      if (this.post.excerpt) {
        let excerpt = this.post.excerpt.rendered || this.post.excerpt
        return excerpt.replace(/<(?:.|\n)*?>/gm, '').substring(0, maxLength)
      } else if (this.content.length > maxLength) {
        let subContent = this.content.replace(/<(?:.|\n)*?>/gm, '').substring(0, maxLength)
        return subContent.length > 0 ? `${subContent} [...]` : subContent
      } else {
        return this.content.replace(/<(?:.|\n)*?>/gm, '')
      }
    },
    link () {
      if (this.post.extra.custom_link && this.post.extra.custom_link.length > 0 && this.post.extra.custom_link !== ' ') {
        return this.post.extra.custom_link
      }
      return this.post.path
    },

    content () {
      let content = ''
      if (this.post.content) {
        content = this.post.content.rendered !== undefined ? this.post.content.rendered : this.post.content
      } else if (this.post.extra && this.post.extra.content) {
        content = this.post.extra.content
      }
      if (!content && this.post.excerpt) {
        content = this.post.excerpt.rendered || this.post.excerpt
      }
      return content
    },

    categories () {
      let categories = this.getTerms('category')
      return categories
    },
    tags () {
      let categories = this.getTerms('post_tag')
      return categories
    },
    type () {
      let trans = this.$store.getters.options.post_type_translations[this.post.type]
      if (trans && trans[this.$store.getters.locale]) {
        return trans[this.$store.getters.locale].title
      }
      return this.post.type
    },
    showSingleBottomAuthor () {
      return !this.renderAsPage && !this.post.extra.hide_author_bio
    },
    postDate () {
      let postDate = this.post.custom_post_date || this.post.date
      return this.formatDateTime(postDate)
    }
  },
  methods: {
    formatDate (date) {
      return utils.getFormattedDate(date)
    },
    formatDateTime (date) {
      return utils.getFormattedDateTime(date)
    },
    placeClicked (place) {
      if (place && place.link) {
        var parser = document.createElement('a')
        parser.href = place.link
        this.$router.push(parser.pathname)
      }
    },

    getTermUri (term, queryVar) {
      let uri = this.buildLink(`/${this.$store.getters.postTypeEndpoint}?${queryVar}=${term.slug}`)
      return uri
    },

    getTerms (type) {
      let termsFound = []
      if (this.post._embedded['wp:term'] && this.post._embedded['wp:term'].length > 0) {
        for (let termKey in this.post._embedded['wp:term']) {
          let terms = this.post._embedded['wp:term'][termKey]
          for (let key in terms) {
            let term = terms[key]
            if (term.taxonomy === type) {
              termsFound.push(term)
            }
          }
        }
      }
      return termsFound
    }
  },
  components: {
    Media,
    PostMap,
    Gallery,
    Comments,
    Author,
    Sharer
  },
  beforeCreate: function () {
    this.$options.components.Related = require('@/fragments/related/Related.vue').default
  }
}
