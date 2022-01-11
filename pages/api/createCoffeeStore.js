import {
  coffeeStoreTable,
  getMinifiedRecords,
  findRecordsByFilter,
} from "../../lib/airtable";

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
      const records = await findRecordsByFilter(id);

      if (records && records.length && records.length > 0) {
        res.status(200).json({ message: "Record already exists", records });
      } else {
        // create a new record if not found

        // validate
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

        const createRecords = await coffeeStoreTable.create([
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
        const records = getMinifiedRecords(createRecords);

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
