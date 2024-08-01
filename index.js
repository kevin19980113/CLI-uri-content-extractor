const axios = require("axios");
const cheerio = require("cheerio");
const { program } = require("commander");

async function getContent(uri) {
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    const response = await axios.get(uri); // if input is a URL, get the content(.html) from the URL
    return response.data;
  } else {
    throw new Error("Inappropriate URI. Please provide a valid URI.");
  }
}

function extractContent(content, selector) {
  const $ = cheerio.load(content); // load HTML content into cheerio
  const elements = $(selector);
  return elements.length > 0
    ? elements.map((index, element) => $(element).text().trim()).get()
    : null;
}

program
  .version("1.0.0")
  .description(
    "A CLI tool to extract text content from a webpage using a CSS selector"
  )
  .arguments("<uri> <selector>") // take arguments from command line
  .action(async (uri, selector) => {
    // action to be performed when the right arguments are provided
    try {
      const content = await getContent(uri);
      const extractedContent = extractContent(content, selector);

      if (extractedContent) {
        // check if content is not null
        console.log(extractedContent);
      } else {
        console.error("No content found matching the given selector.");
        process.exit(1);
      }
    } catch (error) {
      console.error("An error occurred :", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
