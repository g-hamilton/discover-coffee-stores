const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

export const coffeeStoreTable = base("coffee-stores");

const getMinifiedRecord = (record) => {
  return {
    ...record.fields,
  };
};

export const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

export const findRecordsByFilter = async (id) => {
  const foundRecords = await coffeeStoreTable
    .select({ filterByFormula: `id="${id}"` })
    .firstPage(); // returns an array (may be empty if no matching record)

  return getMinifiedRecords(foundRecords);
};
