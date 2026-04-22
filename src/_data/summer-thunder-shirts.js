const { buildFoxyCartUrl, encryptFoxyAttribute } = require('../utils/foxy')
const formatPickupDate = require('../utils/formatPickupDate')

const SIZE_GROUPS = {
  adult: ['Small', 'Medium', 'Large', 'X-Large', '2XL', '3XL', '4XL'],
  child: ['3T', '4T', '5-6', '7'],
  youth: ['S(6-8)', 'M(10-12)', 'L(14-16)'],
}

const PRODUCT_CODE = 'summer-thunder-2026-employee'
const DEFAULT_PRODUCT_NAME = '2026 Summer Thunder T-Shirt'
const DEFAULT_PRICE = '18.00'
const CLOSE_AT = '2026-06-04T23:59:59-04:00'
const DEFAULT_PICKUP_DATE = null
const VARIANT_KEY_SEPARATOR = '::'
const MAX_QUANTITY = 99

function getSizeSkuKey(sizeGroup, size) {
  return [sizeGroup, size].join(VARIANT_KEY_SEPARATOR)
}

const SIZE_SKU_MAP = Object.freeze({
  [getSizeSkuKey('adult', 'Small')]: {
    displaySize: 'Adult Small',
    productName: '2026 Summer Thunder T-Shirt - Adult Small',
    productCode: 'summer-thunder-2026-adult-small',
  },
  [getSizeSkuKey('adult', 'Medium')]: {
    displaySize: 'Adult Medium',
    productName: '2026 Summer Thunder T-Shirt - Adult Medium',
    productCode: 'summer-thunder-2026-adult-medium',
  },
  [getSizeSkuKey('adult', 'Large')]: {
    displaySize: 'Adult Large',
    productName: '2026 Summer Thunder T-Shirt - Adult Large',
    productCode: 'summer-thunder-2026-adult-large',
  },
  [getSizeSkuKey('adult', 'X-Large')]: {
    displaySize: 'Adult X-Large',
    productName: '2026 Summer Thunder T-Shirt - Adult X-Large',
    productCode: 'summer-thunder-2026-adult-x-large',
  },
  [getSizeSkuKey('adult', '2XL')]: {
    displaySize: 'Adult 2XL',
    productName: '2026 Summer Thunder T-Shirt - Adult 2XL',
    productCode: 'summer-thunder-2026-adult-2xl',
  },
  [getSizeSkuKey('adult', '3XL')]: {
    displaySize: 'Adult 3XL',
    productName: '2026 Summer Thunder T-Shirt - Adult 3XL',
    productCode: 'summer-thunder-2026-adult-3xl',
  },
  [getSizeSkuKey('adult', '4XL')]: {
    displaySize: 'Adult 4XL',
    productName: '2026 Summer Thunder T-Shirt - Adult 4XL',
    productCode: 'summer-thunder-2026-adult-4xl',
  },
  [getSizeSkuKey('child', '3T')]: {
    displaySize: 'Child 3T',
    productName: '2026 Summer Thunder T-Shirt - Child 3T',
    productCode: 'summer-thunder-2026-child-3t',
  },
  [getSizeSkuKey('child', '4T')]: {
    displaySize: 'Child 4T',
    productName: '2026 Summer Thunder T-Shirt - Child 4T',
    productCode: 'summer-thunder-2026-child-4t',
  },
  [getSizeSkuKey('child', '5-6')]: {
    displaySize: 'Child 5-6',
    productName: '2026 Summer Thunder T-Shirt - Child 5-6',
    productCode: 'summer-thunder-2026-child-5-6',
  },
  [getSizeSkuKey('child', '7')]: {
    displaySize: 'Child 7',
    productName: '2026 Summer Thunder T-Shirt - Child 7',
    productCode: 'summer-thunder-2026-child-7',
  },
  [getSizeSkuKey('youth', 'S(6-8)')]: {
    displaySize: 'Youth S(6-8)',
    productName: '2026 Summer Thunder T-Shirt - Youth S(6-8)',
    productCode: 'summer-thunder-2026-youth-s-6-8',
  },
  [getSizeSkuKey('youth', 'M(10-12)')]: {
    displaySize: 'Youth M(10-12)',
    productName: '2026 Summer Thunder T-Shirt - Youth M(10-12)',
    productCode: 'summer-thunder-2026-youth-m-10-12',
  },
  [getSizeSkuKey('youth', 'L(14-16)')]: {
    displaySize: 'Youth L(14-16)',
    productName: '2026 Summer Thunder T-Shirt - Youth L(14-16)',
    productCode: 'summer-thunder-2026-youth-l-14-16',
  },
})

const UNIQUE_PRODUCT_CODES = [...new Set(Object.values(SIZE_SKU_MAP).map(({ productCode }) => productCode))]

function getVariantKey(sizeGroup, size) {
  return [sizeGroup, size].join(VARIANT_KEY_SEPARATOR)
}

function composeSizeValue(sizeGroup, size) {
  return `${sizeGroup}-${String(size).toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

function getSizeProductDefinition(sizeGroup, size) {
  const sizeProduct = SIZE_SKU_MAP[getSizeSkuKey(sizeGroup, size)]

  if (!sizeProduct) {
    throw new Error(`Missing Summer Thunder t-shirt SKU definition for ${sizeGroup} / ${size}.`)
  }

  return sizeProduct
}

function buildQuantityParams(productCode) {
  return Object.fromEntries(
    Array.from({ length: MAX_QUANTITY }, (_, index) => {
      const quantity = String(index + 1)

      return [
        quantity,
        `${encryptFoxyAttribute('quantity', quantity, productCode)}=${encodeURIComponent(quantity)}`,
      ]
    })
  )
}

const quantityParamsByProductCode = Object.fromEntries(
  UNIQUE_PRODUCT_CODES.map(productCode => [productCode, buildQuantityParams(productCode)])
)

function getPickUpDateValue(pickUpDate) {
  if (typeof pickUpDate !== 'string') {
    return null
  }

  const trimmedDate = pickUpDate.trim()

  if (!trimmedDate) {
    return null
  }

  return trimmedDate
}

function buildShirtCartUrl({
  productName,
  productCode,
  price,
  sizeGroup,
  size,
  pickUpDate,
  meal,
}) {
  const attributes = {
    name: productName,
    code: productCode,
    price: String(price),
    size: composeSizeValue(sizeGroup, size),
  }

  if (pickUpDate) {
    attributes.pickup = pickUpDate
  }

  if (meal) {
    attributes.meal = meal
  }

  return buildFoxyCartUrl(productCode, attributes)
}

function buildSummerThunderShirtConfig({
  title = '2026 Summer Thunder T-Shirts',
  productName = DEFAULT_PRODUCT_NAME,
  productCode = PRODUCT_CODE,
  price = DEFAULT_PRICE,
  closeAt = CLOSE_AT,
  closeAtDisplay = 'June 4, 2026 at 11:59 PM ET',
  pickUpDate = DEFAULT_PICKUP_DATE,
  pickupCopy = 'Delivery method: Drive-through Pick Up',
  validatePickUpDate = true,
  meal = 'dinner',
} = {}) {
  const normalizedPrice = String(price)
  const configuredPickUpDate = getPickUpDateValue(pickUpDate)
  const formattedPickUpDate = configuredPickUpDate
    ? formatPickupDate(configuredPickUpDate)
    : null

  if (validatePickUpDate && !formattedPickUpDate) {
    throw new Error('Summer Thunder t-shirt configuration requires pickUpDate to build Foxy cart URLs.')
  }

  const variantEntries = Object.entries(SIZE_GROUPS).flatMap(([sizeGroup, sizes]) =>
    sizes.map(size => {
      const sizeProduct = getSizeProductDefinition(sizeGroup, size)

      return [
        getVariantKey(sizeGroup, size),
        {
          sizeGroup,
          size,
          displaySize: sizeProduct.displaySize,
          productName: sizeProduct.productName,
          productCode: sizeProduct.productCode,
          cartUrl: buildShirtCartUrl({
            productName: sizeProduct.productName,
            productCode: sizeProduct.productCode,
            price: normalizedPrice,
            sizeGroup,
            size,
            pickUpDate: formattedPickUpDate,
            meal,
          }),
        },
      ]
    })
  )

  return {
    title,
    productName,
    productCode,
    price: normalizedPrice,
    closeAt,
    closeAtDisplay,
    isClosed: Date.now() >= Date.parse(closeAt),
    pickUpDate: formattedPickUpDate,
    pickupCopy,
    sizeGroups: SIZE_GROUPS,
    quantity: {
      min: 1,
      max: MAX_QUANTITY,
      paramsByProductCode: quantityParamsByProductCode,
    },
    images: {
      front: null,
      back: null,
    },
    variants: Object.fromEntries(variantEntries),
  }
}

module.exports = buildSummerThunderShirtConfig({ validatePickUpDate: false })
module.exports.buildSummerThunderShirtConfig = buildSummerThunderShirtConfig
module.exports.buildShirtCartUrl = buildShirtCartUrl
module.exports.getPickUpDateValue = getPickUpDateValue
module.exports.getSizeSkuKey = getSizeSkuKey
module.exports.getSizeProductDefinition = getSizeProductDefinition
module.exports.sizeSkuMap = SIZE_SKU_MAP
