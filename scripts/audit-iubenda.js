const fs = require('fs')
const path = require('path')

const DIST_DIR = path.join(__dirname, '..', 'dist')
const IUBENDA_LOADER = 'https://embeds.iubenda.com/widgets/c968a54b-5cfe-4847-90a6-154e6d949efa.js'
const GOOGLE_ANALYTICS = 'https://www.googletagmanager.com/gtag/js?id=G-349HHEHL2T'
const FOXYCART_LOADER = 'https://cdn.foxycart.com/dg2go/loader.js'

const findHtmlFiles = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
    const entryPath = path.join(directory, entry.name)
    return entry.isDirectory() ? findHtmlFiles(entryPath) : [entryPath]
  })
  .filter(filePath => filePath.endsWith('.html'))

const findTags = (html, tagName) => html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || []

const getAttribute = (tag, attributeName) => {
  const match = tag.match(new RegExp(`\\s${attributeName}\\s*=\\s*(["'])(.*?)\\1`, 'i'))
  return match ? match[2] : null
}

const hasToken = (value, token) => value !== null && value.split(/[\s,]+/).includes(token)

const failures = []
const htmlFiles = findHtmlFiles(DIST_DIR)

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8')
  const afterHead = html.slice(html.indexOf('<head>') + '<head>'.length).trimStart()

  if (!afterHead.startsWith(`<script type="text/javascript" src="${IUBENDA_LOADER}"></script>`)) {
    failures.push(`${filePath}: Iubenda must be the first element after <head>`)
  }

  const scriptTags = findTags(html, 'script')
  const googleAnalyticsTags = scriptTags.filter(tag => tag.includes(GOOGLE_ANALYTICS))
  const consentGatedGoogleAnalyticsTags = googleAnalyticsTags.filter(tag => (
    getAttribute(tag, 'type') === 'text/plain' &&
    getAttribute(tag, 'data-suppressedsrc') === GOOGLE_ANALYTICS &&
    hasToken(getAttribute(tag, 'class'), '_iub_cs_activate') &&
    hasToken(getAttribute(tag, 'data-iub-purposes'), '4')
  ))

  if (googleAnalyticsTags.some(tag => getAttribute(tag, 'src') === GOOGLE_ANALYTICS)) {
    failures.push(`${filePath}: Google Analytics still loads without Iubenda consent`)
  }

  if (consentGatedGoogleAnalyticsTags.length === 0) {
    failures.push(`${filePath}: consent-gated Google Analytics script is missing`)
  }

  const foxyCartEnabled = findTags(html, 'html')
    .some(tag => getAttribute(tag, 'data-foxy-cart') === 'true')
  const hasFoxyCartLoader = scriptTags
    .some(tag => getAttribute(tag, 'src') === FOXYCART_LOADER)

  if (foxyCartEnabled && !hasFoxyCartLoader) {
    failures.push(`${filePath}: FoxyCart is missing from an ordering page`)
  }

  if (!foxyCartEnabled && hasFoxyCartLoader) {
    failures.push(`${filePath}: FoxyCart loads on a page without ordering`)
  }

  if (/cookieconsent|iframemanager|\/js\/consent\.js/i.test(html)) {
    failures.push(`${filePath}: local consent code remains`)
  }
}

const homePage = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8')
const footerAnchors = findTags(homePage, 'a')
const footerDocuments = [
  { url: 'https://www.iubenda.com/privacy-policy/30869341', whiteLabel: true },
  { url: 'https://www.iubenda.com/privacy-policy/30869341/cookie-policy', whiteLabel: true },
  { url: 'https://www.iubenda.com/terms-and-conditions/30869341', whiteLabel: true },
  { url: 'https://www.iubenda.com/dsar-form/en/c968a54b-5cfe-4847-90a6-154e6d949efa', whiteLabel: false }
]

for (const document of footerDocuments) {
  const anchor = footerAnchors.find(tag => getAttribute(tag, 'href') === document.url)

  if (!anchor) {
    failures.push(`dist/index.html: missing footer embed ${document.url}`)
    continue
  }

  for (const cssClass of ['iubenda-nostyle', 'iubenda-embed', 'iubenda-noiframe']) {
    if (!hasToken(getAttribute(anchor, 'class'), cssClass)) {
      failures.push(`dist/index.html: ${document.url} missing ${cssClass}`)
    }
  }

  if (document.whiteLabel && !hasToken(getAttribute(anchor, 'class'), 'no-brand')) {
    failures.push(`dist/index.html: ${document.url} missing no-brand`)
  }
}

const footerEmbedLoaderCount = homePage.split('https://cdn.iubenda.com/iubenda.js').length - 1
if (footerEmbedLoaderCount < footerDocuments.length) {
  failures.push('dist/index.html: one or more footer embed loaders are missing')
}

for (const cssClass of ['iubenda-cs-uspr-link', 'iubenda-cs-preferences-link']) {
  if (!homePage.includes(cssClass)) failures.push(`dist/index.html: missing ${cssClass}`)
}

const embeddedDocuments = {
  'privacy-policy': 'https://www.iubenda.com/privacy-policy/30869341',
  'cookie-policy': 'https://www.iubenda.com/privacy-policy/30869341/cookie-policy',
  'terms-and-conditions': 'https://www.iubenda.com/terms-and-conditions/30869341',
  'privacy-choices': 'https://www.iubenda.com/dsar-form/en/c968a54b-5cfe-4847-90a6-154e6d949efa'
}

for (const [route, iubendaUrl] of Object.entries(embeddedDocuments)) {
  const html = fs.readFileSync(path.join(DIST_DIR, route, 'index.html'), 'utf8')

  if (!html.includes(`href="${iubendaUrl}"`)) {
    failures.push(`dist/${route}/index.html: missing Iubenda document URL`)
  }

  if (!html.includes('iub-body-embed') || !html.includes('no-brand')) {
    failures.push(`dist/${route}/index.html: missing white-label body embed`)
  }
}

const netlifyConfig = fs.readFileSync(path.join(__dirname, '..', 'netlify.toml'), 'utf8')
if (/from = "\/(privacy-policy|cookie-policy|terms-and-conditions|privacy-choices)\/"/.test(netlifyConfig)) {
  failures.push('netlify.toml: local legal page still has an external redirect')
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Iubenda audit passed for ${htmlFiles.length} HTML files.`)
