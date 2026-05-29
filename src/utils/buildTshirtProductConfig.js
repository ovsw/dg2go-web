const groq = require('groq')
const client = require('./sanityClient')
const overlayDrafts = require('./overlayDrafts')
const urlFor = require('./imageUrl')
const localShirtConfig = require('../_data/summer-thunder-shirts')
const {
  buildSummerThunderShirtConfig,
  getPickUpDateValue,
} = require('../_data/summer-thunder-shirts')

const hasToken = !!client.config().token

function formatCloseAt(closeAt) {
  if (!closeAt) {
    return null
  }

  const closeDate = new Date(closeAt)

  if (Number.isNaN(closeDate.getTime())) {
    return null
  }

  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  }).format(closeDate)
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York',
    timeZoneName: 'short',
  }).format(closeDate)

  return `${datePart} at ${timePart}`
}

function buildGalleryImages(productImages = []) {
  return productImages
    .filter(item => item && item.image)
    .map((item, index) => ({
      src: urlFor(item.image).width(1600).auto('format').url(),
      thumbSrc: urlFor(item.image).width(240).height(240).fit('crop').auto('format').url(),
      alt: item.alt || `Product image ${index + 1}`,
      label: item.label || `Image ${index + 1}`,
      cover: Boolean(item.cover),
    }))
}

function buildShirtConfig(content = null, options = {}) {
  const {
    pageTitleField = 'privatePageTitle',
    pageBuilderField = 'privatePageBuilder',
    closedCopy = 'Shirt details remain here for reference, but new orders are no longer being accepted online.',
    meal,
  } = options
  const closeAt = (content && content.closeAt) || localShirtConfig.closeAt
  const pageTitle = content && content[pageTitleField]
  const pageBuilder = (content && content[pageBuilderField]) || []
  const dynamicPrice = content && typeof content.price === 'number'
    ? content.price.toFixed(2)
    : localShirtConfig.price
  const dynamicProductName = (content && content.productName) || localShirtConfig.productName
  const hasSanityContent = Boolean(content)
  const contentPickUpDate = hasSanityContent
    ? getPickUpDateValue(content.pickUpDate)
    : null
  const closeAtDisplay = formatCloseAt(closeAt)

  if (hasSanityContent && !contentPickUpDate) {
    throw new Error('Summer Thunder t-shirt pages require pickUpDate to build Foxy cart URLs.')
  }

  if (hasSanityContent && !closeAtDisplay) {
    throw new Error('Summer Thunder t-shirt pages require a valid closeAt date from Sanity.')
  }

  const baseOrderConfig = buildSummerThunderShirtConfig({
    title: pageTitle || localShirtConfig.title,
    productName: dynamicProductName,
    productCode: localShirtConfig.productCode,
    price: dynamicPrice,
    closeAt,
    closeAtDisplay: closeAtDisplay || localShirtConfig.closeAtDisplay,
    pickUpDate: hasSanityContent ? contentPickUpDate : undefined,
    pickupCopy: (content && content.pickupCopy) || localShirtConfig.pickupCopy,
    closedCopy,
    validatePickUpDate: hasSanityContent,
    meal,
  })
  return {
    ...baseOrderConfig,
    title: pageTitle || localShirtConfig.title,
    productName: dynamicProductName,
    price: dynamicPrice,
    closeAt,
    closeAtDisplay: baseOrderConfig.closeAtDisplay,
    isClosed: closeAt ? Date.now() >= Date.parse(closeAt) : baseOrderConfig.isClosed,
    pickUpDate: baseOrderConfig.pickUpDate,
    images: buildGalleryImages((content && content.productImages) || []),
    pageBuilder,
    image: (content && content.image) || null,
    seo: {
      title: (content && (content.seoTitle || pageTitle || content.productName)) || localShirtConfig.title,
      description: (content && (content.seoDescription || content.pickupCopy)) || baseOrderConfig.pickupCopy,
      image: (content && content.image) || null,
    },
  }
}

function getRequiredProductDoc(sanityResponse) {
  const [productDoc] = overlayDrafts(hasToken, sanityResponse)

  if (!productDoc || !productDoc.content) {
    throw new Error('Summer Thunder t-shirt pages require the Sanity document tshirtProduct.content.')
  }

  return productDoc
}

async function getSanityShirtConfig(options = {}) {
  let sanityResponse

  try {
    sanityResponse = await client.fetch(groq`
      *[_type == "tshirtProduct" && _id in ["tshirtProduct", "drafts.tshirtProduct"]]{
        ...,
        content {
          ...,
          "seoTitle": coalesce(seo.title, privatePageTitle, publicPageTitle, productName),
          "seoDescription": coalesce(seo.description, pickupCopy)
        }
      }
    `)
  } catch (err) {
    throw new Error(`Summer Thunder t-shirt pages could not fetch Sanity product data: ${err.message}`)
  }

  const productDoc = getRequiredProductDoc(sanityResponse)

  return buildShirtConfig(productDoc.content, options)
}

module.exports = getSanityShirtConfig
module.exports.buildShirtConfig = buildShirtConfig
module.exports.getRequiredProductDoc = getRequiredProductDoc
