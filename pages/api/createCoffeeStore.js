const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const table = base("coffee-stores");

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, neighbourhood, voting, imgUrl } = req.body;

    try {
      // validate
      if (!id) {
        return res
          .status(400)
          .json({ message: "Unable to complete: Missing id field" });
      }

      // find a record
      const foundCoffeeStoreRecords = await table
        .select({ filterByFormula: `id=${id}` })
        .firstPage(); // returns an array (may be empty if no matching record)

      if (
        foundCoffeeStoreRecords &&
        foundCoffeeStoreRecords.length &&
        foundCoffeeStoreRecords.length !== 0
      ) {
        // transform the records if found
        const records = foundCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });

        // return the transformed records
        res.json({ message: "Record already exists", records });
      } else {
        // create a new record if not found

        // validate
        if (!id) {
          return res
            .status(400)
            .json({ message: "Unable to complete: Missing id field" });
        }
        if (!name) {
          return res
            .status(400)
            .json({ message: "Unable to complete: Missing name field" });
        }
        if (!address) {
          return res
            .status(400)
            .json({ message: "Unable to complete: Missing address field" });
        }
        if (!imgUrl) {
          return res
            .status(400)
            .json({ message: "Unable to complete: Missing imgUrl field" });
        }

        const createRecords = await table.create([
          {
            fields: {
              id,
              name,
              address,
              neighbourhood,
              voting,
              imgUrl,
            },
          },
        ]);

        // transform the records if created successfully
        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });

        // return the transformed records
        res.json({ message: "Record created", records });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Oops something went wrong", error: err });
    }
  }
};

export default createCoffeeStore;
