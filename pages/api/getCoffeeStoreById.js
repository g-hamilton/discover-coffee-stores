import { findRecordsByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

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
      res.status(200).json({
        message: `Successfully retrieved records for id: ${id}`,
        records,
      });
    } else {
      res.status(200).json({
        message: `Records for id: ${id} could not be found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
