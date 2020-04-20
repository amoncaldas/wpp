import mediaService from './media-service'

export default {
  created () {
    if (this.mediaId) {
      let context = this

      // get the data related to the userId defined
      mediaService.get(this.mediaId).then((media) => {
        context.mediaPost = media
      }).catch(error => {
        console.log(error)
        context.showError(this.$t('post.thePostCouldNotBeLoaded'))
      })
    } else {
      this.mediaPost = this.media
    }
  },
  props: {
    mediaId: {
      required: false
    },
    media: {
      required: false
    },
    size: {
      default: 'large'
    },
    maxHeight: {
      default: null
    },
    maxWidth: {
      default: null
    },
    contains: {
      default: false
    },
    mode: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      mediaPost: null
    }
  },
  computed: {
    url () {
      if (this.mediaPost) {
        let size = this.lodash.get(this, `mediaPost.media_details.sizes[${this.size}]`)
        if (size) {
          return size.source_url
        } else {
          let sourceUrl = this.lodash.get(this, `mediaPost.media_details.sizes.full.source_url`)
          return sourceUrl
        }
      }
      return null
    },
    title () {
      if (this.mediaPost && this.mediaPost.title && this.mediaPost.title.rendered) {
        return this.mediaPost.title.rendered
      }
      return this.mediaPost.post_title
    },
    placeHolder () {
      return 'https://via.placeholder.com/1024x800.jpg?text=' + this.$t('media.image')
    },
    isListMode () {
      return this.mode === 'list'
    }
  }
}
