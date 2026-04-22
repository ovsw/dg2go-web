const getSanityShirtConfig = require('./utils/buildTshirtProductConfig')

module.exports = async function() {
  return {
    shirtConfig: await getSanityShirtConfig({
      pageTitleField: 'publicPageTitle',
      pageBuilderField: 'publicPageBuilder',
      meal: 'lunch',
    }),
  }
}
