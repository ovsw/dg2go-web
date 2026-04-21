const assert = require('assert')

process.env.FOXYCART_API_KEY = process.env.FOXYCART_API_KEY || 'test-key'

const getSanityShirtConfig = require('../src/utils/buildTshirtProductConfig')
const { buildShirtConfig } = require('../src/utils/buildTshirtProductConfig')

function getQueryParams(url) {
  return new URL(url).searchParams
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
  })

  assert.equal(fallbackConfig.pickUpDate, null)

  const fallbackVariant = fallbackConfig.variants[Object.keys(fallbackConfig.variants)[0]]
  const fallbackParams = getQueryParams(fallbackVariant.cartUrl)

  assert.equal(findDecodedParamValue(fallbackParams, 'null'), false)
  assert.equal(findDecodedParamValue(fallbackParams, ''), false)

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
  })

  assert.equal(configuredConfig.pickUpDate, 'June 10, 2026')

  const configuredVariant = configuredConfig.variants[Object.keys(configuredConfig.variants)[0]]
  const configuredParams = getQueryParams(configuredVariant.cartUrl)

  assert.equal(findDecodedParamValue(configuredParams, 'June 10, 2026'), true)

  console.log('buildTshirtProductConfig tests passed')
}

run()
