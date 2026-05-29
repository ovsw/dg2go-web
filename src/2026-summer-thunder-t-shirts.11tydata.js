const getSanityShirtConfig = require('./utils/buildTshirtProductConfig')

module.exports = async function() {
  return {
    shirtConfig: await getSanityShirtConfig({
      pageTitleField: 'publicPageTitle',
      pageBuilderField: 'publicPageBuilder',
      closedCopy: 'Shirt details remain here for reference, but new orders are no longer being accepted online.',
      meal: 'lunch',
    }),
  }
}
