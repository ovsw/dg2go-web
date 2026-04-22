const getSanityShirtConfig = require('./utils/buildTshirtProductConfig')

module.exports = async function() {
  return {
    shirtConfig: await getSanityShirtConfig({
      pageTitleField: 'privatePageTitle',
      pageBuilderField: 'privatePageBuilder',
      meal: 'dinner',
    }),
  }
}
