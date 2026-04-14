require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
})

const CryptoJS = require('crypto-js')

const FOXYCART_BASE_URL = 'https://dg2go.foxycart.com/cart'

function getFoxyApiKey() {
  const apiKey = process.env.FOXYCART_API_KEY

  if (!apiKey) {
    throw new Error('FOXYCART_API_KEY is required to generate signed ordering links.')
  }

  return apiKey
}

function encryptFoxyAttribute(attrName, attrValue, productCode) {
  const normalizedValue = String(attrValue)
  const concatValue = `${productCode}${attrName}${normalizedValue}`

  return `${attrName}||${CryptoJS.HmacSHA256(concatValue, getFoxyApiKey()).toString()}`
}

function buildFoxyCartUrl(productCode, attributes) {
  const queryString = Object.entries(attributes)
    .map(([attrName, attrValue]) => {
      const normalizedValue = String(attrValue)
      const encryptedName = encryptFoxyAttribute(attrName, normalizedValue, productCode)

      return `${encryptedName}=${encodeURIComponent(normalizedValue)}`
    })
    .join('&')

  return `${FOXYCART_BASE_URL}?${queryString}`
}

module.exports = {
  buildFoxyCartUrl,
  encryptFoxyAttribute,
  FOXYCART_BASE_URL,
}
