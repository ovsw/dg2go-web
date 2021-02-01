const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "events"]{
    ...,
    content {
      ...,
      'seoTitle': coalesce( seo.title ,'not set'),
      'seoDescription': coalesce( seo.description ,'not set'),
       eventsList[]->{
        ...
      }
    }
  }[0]
`).catch(err => console.error(err))

  return sanityResponse
}