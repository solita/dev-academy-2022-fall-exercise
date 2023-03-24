import path from "path"
import { Journey_csv_data, Journey_data } from "../../common"
import { parse } from "csv-parse"
import fs from "fs"
import { csv_journey_schema } from "../models/journey"
import Journey from "../models/journey"
import { csv_data_is_loaded } from "./config"

import debug from "debug"
const debugLog = debug("app:journey_controller:log")
const errorLog = debug("app:journey_controller:error")

const datasets_path = path.join(__dirname, "../../../", "test_datasets", "journeys")
const csv_files = fs.readdirSync(datasets_path)

//Clear all journeys from the database
export async function clear_journeys() {
  try {
    await Journey.deleteMany({})
  } catch (error) {
    errorLog("Failed to clear journeys :", error)
    throw error
  }
}

//import all the csv files in the datasets folder to the database
export async function import_journey_csv_to_database() {
  try {
    //loop through all the csv files in the datasets folder
    for (const file of csv_files) {
      debugLog(`Importing ${file} to the database`)
      const csv_file_path = path.join(datasets_path, file)
      await read_csv_journey_data(csv_file_path)
    }
    debugLog("All journey csv files imported to the database")
  } catch (error) {
    errorLog("Failed to import csv datasets to database :", error)
    throw error
  }
}

function read_csv_journey_data(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    //BOM is a byte order mark, which is a special character that is used to indicate the endianness of a file.
    //This is needed to ensure that the parser can read the file correctly.
    const parser = parse({
      bom: true,
      delimiter: ",",
      columns: true,
      skip_empty_lines: true,
      skip_records_with_error: true,
    })

    //Feature: Validate data before importing
    parser.on("readable", async () => {
      let record: Journey_csv_data
      while ((record = parser.read()) !== null) {
        //Validating the data from the csv file.
        const journey_csv_data_validation = csv_journey_schema.validate(record)
        if (journey_csv_data_validation.error) {
          //If the data is not valid, skip this record
          errorLog(
            "Invalid journey data found, skipping it:",
            journey_csv_data_validation.error
          )
          continue
        }
        //Check that journey is longer than 10 seconds
        if (parseInt(record["Duration (sec.)"]) < 10) {
          //skip this record
          continue
        }
        //Check that journey is longer than 10 meters
        if (parseInt(record["Covered distance (m)"]) < 10) {
          //skip this record
          continue
        }
        //Translating the data from the csv file to the data format that is easier to use and store in the application.
        const results: Journey_data = {
          departure_date: record.Departure,
          return_date: record.Return,
          departure_station_id: record["Departure station id"],
          departure_station_name: record["Departure station name"],
          return_station_id: record["Return station id"],
          return_station_name: record["Return station name"],
          covered_distance: parseInt(record["Covered distance (m)"]),
          duration: parseInt(record["Duration (sec.)"]),
        }

        //save the data to the database
        await save_journey_data(results)
      }
    })

    parser.on("end", () => {
      resolve()
    })

    parser.on('skip', (error) => {
      errorLog("Skipping line in csv file due to error :", error.message)
    });

    parser.on("error", (error: any) => {
      reject(error)
    })

    //Read the csv file and pipe it to the parser.
    fs.createReadStream(filePath).pipe(parser)
  })
}

async function save_journey_data(data: Journey_data) {
  const new_journey = new Journey(data)
  await new_journey.save()
}
