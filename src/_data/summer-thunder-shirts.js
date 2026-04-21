const { buildFoxyCartUrl, encryptFoxyAttribute } = require('../utils/foxy')
const formatPickupDate = require('../utils/formatPickupDate')

const EMPLOYEE_LOCATIONS = [
  {
    label: 'DelGrosso Amusement Park',
    department: 'DAP',
  },
  {
    label: "Marianna's Fundraisers",
    department: 'MFR',
  },
  {
    label: 'DGF Red Sauce Plant',
    department: 'DGF Red',
  },
  {
    label: 'DGF White Sauce Plant',
    department: 'DGF White',
  },
]

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

function getVariantKey(employeeLocation, sizeGroup, size) {
  return [employeeLocation, sizeGroup, size].join(VARIANT_KEY_SEPARATOR)
}

function composeSizeValue(sizeGroup, size) {
  return `${sizeGroup}-${String(size).toLowerCase().replace(/[^a-z0-9]+/g, '')}`
}

const quantityParams = Object.fromEntries(
  Array.from({ length: MAX_QUANTITY }, (_, index) => {
    const quantity = String(index + 1)

    return [
      quantity,
      `${encryptFoxyAttribute('quantity', quantity, PRODUCT_CODE)}=${encodeURIComponent(quantity)}`,
    ]
  })
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

  const variantEntries = EMPLOYEE_LOCATIONS.flatMap(({ label, department }) =>
    Object.entries(SIZE_GROUPS).flatMap(([sizeGroup, sizes]) =>
      sizes.map(size => {
        const attributes = {
          name: productName,
          code: productCode,
          price: normalizedPrice,
          department,
          size: composeSizeValue(sizeGroup, size),
        }

        if (formattedPickUpDate) {
          attributes.pickup = formattedPickUpDate
        }

        attributes.meal = meal

        return [
          getVariantKey(label, sizeGroup, size),
          {
            employeeLocation: label,
            department,
            sizeGroup,
            size,
            cartUrl: buildFoxyCartUrl(productCode, attributes),
          },
        ]
      })
    )
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
    employeeLocations: EMPLOYEE_LOCATIONS.map(({ label }) => label),
    sizeGroups: SIZE_GROUPS,
    quantity: {
      min: 1,
      max: MAX_QUANTITY,
      params: quantityParams,
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
module.exports.getPickUpDateValue = getPickUpDateValue
