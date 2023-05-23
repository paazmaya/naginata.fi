/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({"src/img": "img"});
  eleventyConfig.addPassthroughCopy({"src/icons": "icons"});
  eleventyConfig.addPassthroughCopy({"assets": "/"});

  const facebook = require("./lib/facebook-meta");
  eleventyConfig.addGlobalData("facebook", facebook());

  const flickrImageList = require("./lib/flickr-image-list");
  eleventyConfig.addGlobalData("prefetch", flickrImageList());

  // Create language specific collections, to reduce complexity in templates
  eleventyConfig.addCollection("en", function(api) {
    return api.getFilteredByGlob('*/en/*.md');
  });
  eleventyConfig.addCollection("fi", function(api) {
    return api.getFilteredByGlob('*/fi/*.md');
  });
  eleventyConfig.addCollection("ja", function(api) {
    return api.getFilteredByGlob('*/ja/*.md');
  });

  return {
    dir: {

      input: "content",
      includes: "../views", // relative to dir.input

      output: "dist"
    },
    data: {
      layout: "index.html",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  }
};
