const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-stores");

const createCoffeeStore = (req, res) => {
  if (req.method === "POST") {
    res.status(200).json({ message: "Hi there!" });
  } else {
    res.json({ message: "Sorry I only accept POST requests!" });
  }
};

export default createCoffeeStore;
