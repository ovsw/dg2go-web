// following are required for portable text filter:
const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const { markdownToTxt } = require('markdown-to-txt')
const CryptoJS = require("crypto-js")
const sitemap = require("@quasibit/eleventy-plugin-sitemap")

const client = require('./src/utils/sanityClient.js')
const serializers = require('./src/utils/serializers')
const urlFor = require('./src/utils/imageUrl')

// FILTERS
const dateFilter = require('./src/filters/date-filter.js')
const dateFilterMeals = require('./src/filters/date-filter-meals.js')
const dateFilterYear = require('./src/filters/date-filter-year.js')
const w3DateFilter = require('./src/filters/w3-date-filter.js')
const encodeUri = require('./src/filters/encode-uri.js')

// Transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = config => {
  // Set directories to pass through to the dist folder
  config.addPassthroughCopy('./src/images/');
  // Copy `./src/js/` to the dist folder
  config.addPassthroughCopy("./src/js/");
  // Copy favicons
  config.addPassthroughCopy({ "./src/favicons/": "/" });

  // ////////////////////////////////////
  // process markdown from Sanity
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  config.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  config.addFilter("markdownify", function(value) {
    const md = new markdownIt(options)
    return md.render(value)
  })
  // end markdown 
  // ////////////////////////////////////

  // ////////////////////////////////////
  // filter to process portable text (block content) - needed for arrays of different sections from the back-end
  config.addFilter("blocksToMarkdown", function(sanityBlockContent) {
    return BlocksToMarkdown(sanityBlockContent, { serializers, ...client.config() })
  })
  // end portable text filter

  // fiter to convert markdown to plain text, mainly used for creating excerpts for SEO descriptions
  config.addFilter("markdownToText", function(markdownContent) {
    return markdownToTxt(markdownContent)
  })

  // ////////////////////////////////////

  // add date filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('dateFilterMeals', dateFilterMeals);
  config.addFilter('dateFilterYear', dateFilterYear);
  config.addFilter('w3DateFilter', w3DateFilter);

  // other filters
  config.addFilter('encodeUri', encodeUri);

  // ////////////////////////////////////
  // sanity images shortcodes

  config.addShortcode('imageUrlFor', (image, width = "400") => {
    return urlFor(image)
        .width(width)
        .auto('format')
  })
  config.addShortcode('croppedUrlFor', (image, width, height) => {
    return urlFor(image)
        .width(width)
        .height(height)
        .auto('format')
  })

  config.addShortcode('responsiveImage', (image, srcs="320,640,900", sizes="100vw", classList="", alt="") => {
    const sizeArray = srcs.split(',');
    const firstSize = sizeArray[0];
    const lastSize = sizeArray[sizeArray.length - 1];
    const srcSetContent = sizeArray.map((size) => {
        const url = urlFor(image)
            .width(size)
            .auto('format')
            .url()

        return `${url} ${size}w`
    }).join(',')

    return (
        `<img 
            src="${urlFor(image).width(firstSize)}"
            ${classList ? "class='" + classList + "'" : ""}
            srcset="${srcSetContent}"
            sizes="${sizes}"
            width="${lastSize.trim()}" 
            alt="${alt}" >`
    )
  })

  config.addShortcode('heroResponsiveBgImage', (image) => {
    const mobileUrl = urlFor(image)
        .width(400)
        .height(400)
        .auto('format')
    const desktopUrl = urlFor(image)
        .width(1600)
        .height(774)
        .auto('format')

    return (
      `<style>.hero {background-image: url('${mobileUrl}')}
      @media screen and (min-width: 1600px) {.hero {background-image: url('${desktopUrl}')}}</style>`
    )
  })

  config.addShortcode('pageHeaderResponsiveBgImage', (image, mobileW=400, mobileH=400, deskW=1600, deskH=774) => {
    const mobileUrl = urlFor(image)
        .width(mobileW)
        .height(mobileH)
        .auto('format')
    const desktopUrl = urlFor(image)
        .width(deskW)
        .height(deskH)
        .auto('format')

    return (
      `<style>.page-header {background-image: url('${mobileUrl}')}
      @media screen and (min-width: 1600px) {.page-header {background-image: url('${desktopUrl}')}}</style>`
    )
  })

  config.addShortcode('foxyEncrypt', (attrName, attrValue, productCode) => {
    const apiKey = process.env.FOXYCART_API_KEY
    const encodingval = encodeURIComponent(productCode + attrName + attrValue)
    const concatval = productCode + attrName + attrValue
    return attrName + '||' + CryptoJS.HmacSHA256(concatval, apiKey)
    // let out = CryptoJS.HmacSHA256(string, apiKey)
    // return encodingval
  })

  // ////////////////////////////////////

  // Nunjucks Filter for converting sring to kebab-case
  config.addNunjucksFilter("makeId", function(value) {
     return value.replace(/\s+/g, '-').toLowerCase()
  });

  config.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.dg2gofoods.com",
    },
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  // Only minify HTML if we are in production because it slows builds _right_ down
  if (isProduction) {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};