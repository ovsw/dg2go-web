const groq = require('groq')
const client = require('./sanityClient')
const overlayDrafts = require('./overlayDrafts')
const urlFor = require('./imageUrl')
const { buildFoxyCartUrl } = require('./foxy')
const localShirtConfig = require('../_data/summer-thunder-shirts')
const { buildSummerThunderShirtConfig, normalizePickUpDate } = require('../_data/summer-thunder-shirts')

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

function composeSizeValue(sizeGroup, size) {
  return `${sizeGroup}-${String(size).toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

function buildPublicVariants(variants, shirtConfig) {
  return Object.values(variants).reduce((acc, variant) => {
    const key = [variant.sizeGroup, variant.size].join('::')

    if (!acc[key]) {
      const attributes = {
        name: shirtConfig.productName,
        code: shirtConfig.productCode,
        price: shirtConfig.price,
        size: composeSizeValue(variant.sizeGroup, variant.size),
      }

      if (shirtConfig.pickUpDate) {
        attributes.pickup = shirtConfig.pickUpDate
      }

      acc[key] = {
        ...variant,
        cartUrl: buildFoxyCartUrl(shirtConfig.productCode, attributes),
      }
    }

    return acc
  }, {})
}

function buildShirtConfig(content = null, options = {}) {
  const {
    pageTitleField = 'privatePageTitle',
    pageBuilderField = 'privatePageBuilder',
    showEmployeeLocation = true,
  } = options
  const closeAt = (content && content.closeAt) || localShirtConfig.closeAt
  const pageTitle = content && content[pageTitleField]
  const pageBuilder = (content && content[pageBuilderField]) || []
  const dynamicPrice = content && typeof content.price === 'number'
    ? content.price.toFixed(2)
    : localShirtConfig.price
  const dynamicProductName = (content && content.productName) || localShirtConfig.productName
  const hasSanityContent = Boolean(content)
  const pickUpDate = hasSanityContent
    ? normalizePickUpDate(content.pickUpDate)
    : localShirtConfig.pickUpDate

  if (hasSanityContent && !pickUpDate) {
    throw new Error('Summer Thunder t-shirt pages require pickUpDate to build Foxy cart URLs.')
  }

  const baseOrderConfig = buildSummerThunderShirtConfig({
    title: pageTitle || localShirtConfig.title,
    productName: dynamicProductName,
    productCode: localShirtConfig.productCode,
    price: dynamicPrice,
    closeAt,
    closeAtDisplay: formatCloseAt(closeAt) || localShirtConfig.closeAtDisplay,
    pickUpDate,
    pickupCopy: (content && content.pickupCopy) || localShirtConfig.pickupCopy,
    validatePickUpDate: hasSanityContent,
  })
  const variants = showEmployeeLocation
    ? baseOrderConfig.variants
    : buildPublicVariants(baseOrderConfig.variants, baseOrderConfig)

  return {
    ...baseOrderConfig,
    title: pageTitle || localShirtConfig.title,
    productName: dynamicProductName,
    price: dynamicPrice,
    closeAt,
    closeAtDisplay: baseOrderConfig.closeAtDisplay,
    isClosed: closeAt ? Date.now() >= Date.parse(closeAt) : baseOrderConfig.isClosed,
    pickUpDate,
    images: buildGalleryImages((content && content.productImages) || []),
    pageBuilder,
    image: (content && content.image) || null,
    employeeLocations: showEmployeeLocation ? baseOrderConfig.employeeLocations : [],
    variants,
    showEmployeeLocation,
    seo: {
      title: (content && (content.seoTitle || pageTitle || content.productName)) || localShirtConfig.title,
      description: (content && (content.seoDescription || content.pickupCopy)) || baseOrderConfig.pickupCopy,
      image: (content && content.image) || null,
    },
  }
}

async function getSanityShirtConfig(options = {}) {
  const sanityResponse = await client.fetch(groq`
    *[_type == "tshirtProduct" && _id in ["tshirtProduct", "drafts.tshirtProduct"]]{
      ...,
      content {
        ...,
        "seoTitle": coalesce(seo.title, privatePageTitle, publicPageTitle, productName),
        "seoDescription": coalesce(seo.description, pickupCopy)
      }
    }
  `).catch(err => {
    console.error(err)
    return []
  })

  const [productDoc] = overlayDrafts(hasToken, sanityResponse)

  return buildShirtConfig(productDoc && productDoc.content, options)
}

module.exports = getSanityShirtConfig
module.exports.buildShirtConfig = buildShirtConfig
