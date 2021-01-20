const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "specials"]{
    ...,
     content {
      ...,
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