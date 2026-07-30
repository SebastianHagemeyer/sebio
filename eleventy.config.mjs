// Eleventy build for the Hallam Interactives static site.
// Input lives in src/, output goes to _site/ (the GitHub Pages deploy root).
// Pages are plain HTML; inline <script>/<style> is NOT run through a template
// engine (htmlTemplateEngine: false), so JS/CSS braces are never misparsed.
// Shared chrome is provided by the Nunjucks layout in src/_includes.
export default function (eleventyConfig) {
  // Static assets pass through untouched. CSS/JS are not Eleventy template
  // formats and images/audio are binary; paths under src/ map to _site/.
  // csv is here for the Data Lab datasets: without it the CSVs are silently
  // left out of _site/ and every download link on the page 404s.
  eleventyConfig.addPassthroughCopy(
    "src/**/*.{css,js,csv,png,jpg,jpeg,gif,svg,webp,ico,mp3}",
  );

  // CNAME and .nojekyll are needed at the deploy root by GitHub Pages.
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

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
