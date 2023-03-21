import { Request, Response } from "express"
import path from "path"
import { Journey_csv_data, Journey_data } from "../../common"
import { parse } from "csv-parse"
import fs from "fs"
import { csv_database_schema } from "../models/database"
import { object } from "joi"

const get_database = async (req: Request, res: Response) => {
  try {
    const csv_file_path = path.join(
      __dirname,
      "../../../",
      "datasets",
      "2021-05.csv"
    )
    const data = await read_csv_journey_data(csv_file_path)
    res.send(data)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

function read_csv_journey_data(filePath: string): Promise<Journey_data[]> {
  const results: Journey_data[] = []

  return new Promise((resolve, reject) => {
    //BOM is a byte order mark, which is a special character that is used to indicate the endianness of a file.
    //This is needed to ensure that the parser can read the file correctly and get the first column item.
    const parser = parse({
      bom: true,
      delimiter: ",",
      columns: true,
      skip_empty_lines: true,
    })

    parser.on("readable", () => {
      let record: Journey_csv_data
      while ((record = parser.read()) !== null) {
        const journey_csv_data_validation = csv_database_schema.validate(record)

        if (journey_csv_data_validation.error) {
          reject(journey_csv_data_validation.error)
        } else {
          //Translating the data from the csv file to the data format that is easier to use in the application.
          results.push({
            departure_date: record.Departure,
            return_date: record.Return,
            departure_station_id: record["Departure station id"],
            departure_station_name: record["Departure station name"],
            return_station_id: record["Return station id"],
            return_station_name: record["Return station name"],
            covered_distance: parseInt(record["Covered distance (m)"]),
            duration: parseInt(record["Duration (sec.)"]),
          })
        }
      }
    })

    parser.on("end", () => {
      resolve(results)
    })

    parser.on("error", (error: any) => {
      reject(error)
    })

    fs.createReadStream(filePath).pipe(parser)
  })
}

export default {
  get_database,
}
