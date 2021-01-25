const groq = require('groq')
const client = require('../utils/sanityClient')

module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "special"]{
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
  `).catch(err => console.error(err))

  return sanityResponse
}