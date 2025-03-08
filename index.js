const express = require("express");
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

const scrapeAboutUs = async () => {
  try {
    console.log("Fetching webpage...");
    const response = await axios.get("https://rca.ac.rw/about-us.php", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    console.log("Page fetched successfully!");
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract heading
    const heading = $(".container .heading").text().trim();

    // Extract paragraphs
    let aboutText = [];
    $(".container p").each((index, element) => {
      aboutText.push($(element).text().trim());
    });

    console.log("Extraction complete!");
    return { heading, aboutText };
  } catch (error) {
    console.error("Scraping error:", error.message);
    return null;
  }
};

app.get("/about-us", async (req, res) => {
  try {
    const data = await scrapeAboutUs();
    if (!data) {
      return res.status(500).json({ error: "Failed to scrape data" });
    }
    return res.status(200).json({ result: data });
  } catch (err) {
    return res.status(500).json({ err: err.toString() });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT || 5000}`);
});
