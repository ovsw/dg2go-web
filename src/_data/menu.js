const moment = require('moment')
const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const groq = require('groq')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token

function generateMenuItem (menuItem) {
  const shortDate = moment(new Date(menuItem.date)).format('ddd Do MMM ')
  const longDate = moment(new Date(menuItem.date)).format('ddd Do MMM YYYY')
  return {
    ...menuItem,
    dishNameURI: encodeURI(menuItem.name),
    shortDate: shortDate,
    longDate: longDate
  }
}

async function getMenu () {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "menuItem"]`
  const projection = groq`{
    _id,
  	date,
  	"name": dish->name,
  	"description": dish->description,
  	"price": dish->price,
  	"image": dish->mainImage
  }`
  const order = `| order(date asc)`
  const query = [filter, projection, order].join(' ')
  const docs = await client.fetch(query).catch(err => console.error(err))
  const reducedDocs = overlayDrafts(hasToken, docs)
  const prepareItems = reducedDocs.map(generateMenuItem)
  return prepareItems
}

module.exports = getMenu
