const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token
const locallyManagedSlugs = new Set([
  'privacy-policy',
  'cookie-policy',
  'terms-and-conditions',
  'privacy-choices'
])


function generatePageWithSeo (page) {

  const deoDescription = page.content.seoDescription != '' ? page.content.seo.seoDescription :  'excerpt'
  // const seoDescription = page.content.seo.description || pageBOdyTextTruncated

  return {
    ...page,
    seoDescription: deoDescription
  }
}


module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "page"]{
    ...,
    content {
      ...,
  		'seoTitle': coalesce(seo.title, title),
			'seoDescription': coalesce(seo.description, ''),
			sections[] {
        ...,
        reusableSection->{
          ...
        }
      }
    }
  }
  `).catch(err => console.error(err))

  
  const reducedDocs = overlayDrafts(hasToken, sanityResponse)
  
  const prepareItems = reducedDocs
    .filter(page => !locallyManagedSlugs.has(page.content.slug.current))
    .map(generatePageWithSeo)

  return prepareItems
}
