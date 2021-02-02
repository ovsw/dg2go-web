const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

const serializers = require('../utils/serializers')
const blocksToHtml = require('@sanity/block-content-to-html')


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
  
  const prepareItems = reducedDocs.map(generatePageWithSeo)

  return prepareItems
}