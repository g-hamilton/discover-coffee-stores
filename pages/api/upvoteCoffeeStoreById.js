import {
  findRecordsByFilter,
  coffeeStoreTable,
  getMinifiedRecords,
} from "../../lib/airtable";

const upvoteCoffeeStoreById = async (req, res) => {
  // validate request type
  if (req.method !== "PUT") {
    return res
      .status(400)
      .json({ message: "Invalid request type. Expecting PUT." });
  }

  const { id } = req.body;

  // validate id
  if (!id) {
    return res
      .status(400)
      .json({ message: "Unable to complete: Missing id field" });
  }

  try {
    // find a record
    const records = await findRecordsByFilter(id);

    if (records && records.length && records.length > 0) {
      // record exists - calculate voting
      const record = records[0];
      const calculateVoting = parseInt(record.voting) + 1;

      // update db record
      const updateRecords = await coffeeStoreTable.update([
        {
          id: record.recordId,
          fields: {
            voting: calculateVoting,
          },
        },
      ]);

      res
        .status(200)
        .json({
          message: "Upvote successful",
          id,
          records: getMinifiedRecords(updateRecords),
        });
    } else {
      // record not found
      res.status(200).json({
        message: `Records for id: ${id} could not be found`,
      });
    }
  } catch (error) {
    // server error
    console.error({ error });
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default upvoteCoffeeStoreById;
