/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
import facebook from './lib/facebook-meta.js';
import flickrImageList from './lib/flickr-image-list.js';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({
    'src/img': 'img'
  });
  eleventyConfig.addPassthroughCopy({
    'src/icons': 'icons'
  });
  eleventyConfig.addPassthroughCopy({
    assets: '/'
  });

  eleventyConfig.addGlobalData('facebook', facebook());
  eleventyConfig.addGlobalData('prefetch', flickrImageList());

  // Create language specific collections, to reduce complexity in templates
  eleventyConfig.addCollection('en', function(api) {
    return api.getFilteredByGlob('*/en/*.md');
  });
  eleventyConfig.addCollection('fi', function(api) {
    return api.getFilteredByGlob('*/fi/*.md');
  });
  eleventyConfig.addCollection('ja', function(api) {
    return api.getFilteredByGlob('*/ja/*.md');
  });

  return {
    dir: {

      input: 'content',
      includes: '../views', // relative to dir.input

      output: 'dist'
    },
    data: {
      layout: 'index.html'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
}
