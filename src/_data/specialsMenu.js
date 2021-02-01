const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "specials"]{
    ...,
     content {
      ...,
      'seoTitle': coalesce( seo.title ,'not set'),
      'seoDescription': coalesce( seo.description ,'not set'),
       specials[]->{
        ...,
        content {
          ...,
          dishes[] {
            ...,
            dish->{
              ...
            }
          }
        }
      }
     }
  }[0]
  `).catch(err => console.error(err))

  return sanityResponse
}