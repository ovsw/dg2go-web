const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "menuPizzaShop"]{
    ...,
    content {
      ...,
      'seoTitle': coalesce( seo.title ,''),
      'seoDescription': coalesce( seo.description ,''),
      deepDishPizzaMenu[]->{
        ...
      },
      frozenPastaMenu[]->{
        ...
      },
      juniorHoagieMenu[]->{
        ...
      },
      originalPizzaMenu[]->{
        ...
      }
    }
  }[0]
  `).catch(err => console.error(err))

  return sanityResponse
}