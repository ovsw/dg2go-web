const getSanityShirtConfig = require('./utils/buildTshirtProductConfig')

module.exports = async function() {
  return {
    shirtConfig: await getSanityShirtConfig({
      pageTitleField: 'privatePageTitle',
      pageBuilderField: 'privatePageBuilder',
      closedCopy: 'Shirt details remain here for reference, but new employee orders are no longer being accepted online.',
      meal: 'dinner',
    }),
  }
}
