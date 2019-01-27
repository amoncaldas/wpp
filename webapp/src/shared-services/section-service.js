import ModelServ from '@/core/model-service'

let options = {
  raw: true, // we dont need each menu resource to be converted to a Model (@/core/model), because it is a read-only resource,
  transformResponse: (response) => {
    if (response.data && response.config.method === 'query') {
      var parser = document.createElement('a')
      for (let key in response.data) {
        let section = response.data[key]
        parser.href = section.link
        response.data[key].link = parser.pathname
      }
    }
  }
}

const sectionService = new ModelServ('wp/v2/sections?_embed', 'section', options)

export default sectionService
