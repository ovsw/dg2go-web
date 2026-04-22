const assert = require('assert')

process.env.FOXYCART_API_KEY = process.env.FOXYCART_API_KEY || 'test-key'

const getSanityShirtConfig = require('../src/utils/buildTshirtProductConfig')
const { buildShirtConfig } = require('../src/utils/buildTshirtProductConfig')
const formatPickupDate = require('../src/utils/formatPickupDate')

function getQueryParams(url) {
  return new URL(url).searchParams
}

function getDecodedEntryNames(searchParams) {
  return Array.from(searchParams.keys()).map(key => key.split('||')[0])
}

function findDecodedParamValue(searchParams, expectedValue) {
  for (const [, value] of searchParams.entries()) {
    if (value === expectedValue) {
      return true
    }
  }

  return false
}

function run() {
  const fallbackConfig = buildShirtConfig(null, {
    pageTitleField: 'publicPageTitle',
    pageBuilderField: 'publicPageBuilder',
    showEmployeeLocation: false,
    meal: 'lunch',
  })

  assert.equal(fallbackConfig.pickUpDate, null)

  const fallbackVariant = fallbackConfig.variants[Object.keys(fallbackConfig.variants)[0]]
  const fallbackParams = getQueryParams(fallbackVariant.cartUrl)

  assert.equal(findDecodedParamValue(fallbackParams, 'null'), false)
  assert.equal(findDecodedParamValue(fallbackParams, ''), false)
  assert.equal(findDecodedParamValue(fallbackParams, 'lunch'), true)

  assert.throws(() => buildShirtConfig({
    productName: 'Configured Shirt',
    pickupCopy: 'Pickup available onsite',
  }), /pickUpDate/)

  const configuredConfig = buildShirtConfig({
    productName: 'Configured Shirt',
    pickUpDate: '2026-06-10',
    pickupCopy: 'Pickup available onsite',
  }, {
    pageTitleField: 'publicPageTitle',
    pageBuilderField: 'publicPageBuilder',
    showEmployeeLocation: false,
    meal: 'lunch',
  })

  assert.equal(configuredConfig.pickUpDate, formatPickupDate('2026-06-10'))

  const configuredVariant = configuredConfig.variants[Object.keys(configuredConfig.variants)[0]]
  const configuredParams = getQueryParams(configuredVariant.cartUrl)

  assert.equal(findDecodedParamValue(configuredParams, formatPickupDate('2026-06-10')), true)
  assert.equal(findDecodedParamValue(configuredParams, 'lunch'), true)
  assert.deepEqual(
    getDecodedEntryNames(configuredParams).slice(0, 6),
    ['name', 'code', 'price', 'size', 'pickup', 'meal']
  )

  const privateConfig = buildShirtConfig({
    productName: 'Configured Shirt',
    pickUpDate: '2026-06-10',
    pickupCopy: 'Pickup available onsite',
  }, {
    pageTitleField: 'privatePageTitle',
    pageBuilderField: 'privatePageBuilder',
    showEmployeeLocation: true,
    meal: 'dinner',
  })

  const privateVariant = privateConfig.variants[Object.keys(privateConfig.variants)[0]]
  const privateParams = getQueryParams(privateVariant.cartUrl)

  assert.equal(findDecodedParamValue(privateParams, 'dinner'), true)
  assert.deepEqual(
    getDecodedEntryNames(privateParams).slice(0, 6),
    ['name', 'code', 'price', 'size', 'pickup', 'meal']
  )

  console.log('buildTshirtProductConfig tests passed')
}

run()
