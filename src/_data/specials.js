const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "special" && content.hideFromCustomers != true ]{
    ...,
     content {
      ...,
      'seoTitle': coalesce( seo.title , name),
      'seoDescription': coalesce( seo.description , shortDescription),
      dishes[] {
        ...,
        "hidden": coalesce(hidden, false),
        dish->{
          ...,
          hidden: 
        }
      }
    }
  }
  `).catch(err => console.error(err))

  const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  return reducedDocs
}