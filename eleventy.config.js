module.exports = function (eleventyConfig) {
  // Nezpracovávat jako šablony – jen zkopírovat (passthrough)
  eleventyConfig.ignores.add("obchodni-podminky.html");
  eleventyConfig.ignores.add("smlouva.html");
  eleventyConfig.ignores.add("dekujeme.html");
  eleventyConfig.ignores.add("clanky.html");
  eleventyConfig.ignores.add("clanky/*.html");

  // Dokumentaci nepublicovat jako webové stránky
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add("DOCUMENTACE.md");

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("data");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy(".nojekyll");
  eleventyConfig.addPassthroughCopy("obchodni-podminky.html");
  eleventyConfig.addPassthroughCopy("smlouva.html");
  eleventyConfig.addPassthroughCopy("dekujeme.html");
  eleventyConfig.addPassthroughCopy("clanky.html");
  eleventyConfig.addPassthroughCopy("clanky");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
