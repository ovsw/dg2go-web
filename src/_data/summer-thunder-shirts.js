const { buildFoxyCartUrl, encryptFoxyAttribute } = require('../utils/foxy')

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

function normalizePickUpDate(pickUpDate) {
  if (typeof pickUpDate !== 'string') {
    return null
  }

  const trimmedDate = pickUpDate.trim()

  if (!trimmedDate) {
    return null
  }

  const isoDateMatch = trimmedDate.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/)

  if (isoDateMatch) {
    const [, year, month, day] = isoDateMatch
    const normalizedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12))
    const dayOfMonth = Number(
      new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        timeZone: 'America/New_York',
      }).format(normalizedDate)
    )
    const monthYear = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'America/New_York',
    }).format(normalizedDate)

    let ordinalSuffix = 'th'

    if (dayOfMonth % 100 < 11 || dayOfMonth % 100 > 13) {
      if (dayOfMonth % 10 === 1) ordinalSuffix = 'st'
      if (dayOfMonth % 10 === 2) ordinalSuffix = 'nd'
      if (dayOfMonth % 10 === 3) ordinalSuffix = 'rd'
    }

    return `${dayOfMonth}${ordinalSuffix} of ${monthYear}`
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
} = {}) {
  const normalizedPrice = String(price)
  const normalizedPickUpDate = normalizePickUpDate(pickUpDate)

  if (validatePickUpDate && !normalizedPickUpDate) {
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

        if (normalizedPickUpDate) {
          attributes.pickup = normalizedPickUpDate
        }

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
    pickUpDate: normalizedPickUpDate,
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
module.exports.normalizePickUpDate = normalizePickUpDate
