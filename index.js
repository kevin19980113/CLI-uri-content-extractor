const axios = require("axios");
const cheerio = require("cheerio");
const { program } = require("commander");

program
  .version("1.0.0")
  .description(
    "A CLI tool to extract text content from a webpage using a CSS selector"
  )
  .argument("<url>", "URL of the webpage")
  .argument("<selector>", "CSS selector to match the element") // take arguments from command line
  .action(async (url, selector) => {
    // action to be performed when the right arguments are provided
    try {
      const response = await axios.get(url); // get URL
      const $ = cheerio.load(response.data); // load HTML into cheerio
      const element = $(selector); // select element using CSS selector

      if (element.length === 0) {
        console.error("No element found matching the given selector.");
        process.exit(1); // exit if no element found
      }

      console.log(element.text().trim()); // print text content of the selected element
    } catch (error) {
      console.error("An error occurred:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv); // start parsing command-line arguments
