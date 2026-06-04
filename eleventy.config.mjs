// Eleventy build for the SEBIO static site.
// Input lives in src/, output goes to _site/ (the GitHub Pages deploy root).
// Pages are plain HTML; inline <script>/<style> is NOT run through a template
// engine (htmlTemplateEngine: false), so JS/CSS braces are never misparsed.
// Shared chrome is provided by the Nunjucks layout in src/_includes (Phase 2c).
export default function (eleventyConfig) {
  // Static assets pass through untouched. CSS/JS are not Eleventy template
  // formats and images/audio are binary; paths under src/ map to _site/.
  eleventyConfig.addPassthroughCopy("src/**/*.{css,js,png,jpg,jpeg,gif,svg,webp,ico,mp3}");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk"],
    htmlTemplateEngine: false,
    markdownTemplateEngine: false,
  };
}
