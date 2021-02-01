const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "special"]{
    ...,
     content {
      ...,
      'seoTitle': coalesce( seo.title , name),
      'seoDescription': coalesce( seo.description , shortDescription),
          dishes[] {
            ...,
            dish->{
              ...
            }
          }
     }
  }
  `).catch(err => console.error(err))

  const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  return reducedDocs
}