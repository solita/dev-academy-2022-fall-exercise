import path from "path"
import { parse } from "csv-parse"
import fs from "fs"
import { csv_station_schema } from "../models/station"
import Station from "../models/station"
import { csv_data_is_loaded } from "./config"
import { Station_csv_data, Station_data, Stored_station_data } from "../../common"
import { Request, Response } from "express"
import { Document } from "mongoose"

import debug from "debug"
import Joi from "joi"
const debugLog = debug("app:Station_controller:log")
const errorLog = debug("app:Station_controller:error")

const datasets_path = path.join(__dirname, "../../../", "datasets", "stations")
const csv_files = fs.readdirSync(datasets_path)

//Clear all Stations from the database
export async function clear_stations() {
  try {
    debugLog("Clearing Stations from the database")
    return Station.deleteMany({})
  } catch (error) {
    errorLog("Failed to clear Stations :", error)
    throw error
  }
}

//import all the csv files in the datasets folder to the database
export async function import_stations_csv_to_database() {
  try {
    //loop through all the csv files in the datasets folder
    for (const file of csv_files) {
      debugLog(`Importing ${file} to the database`)
      const csv_file_path = path.join(datasets_path, file)
      await read_csv_Station_data(csv_file_path)
    }
    debugLog("All station csv files imported to the database")
    return csv_data_is_loaded()
  } catch (error) {
    errorLog("Failed to import csv datasets to database :", error)
    throw error
  }
}

function read_csv_Station_data(filePath: string): Promise<void> {
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
      let record: Station_csv_data
      while ((record = parser.read()) !== null) {
        //Validating the data from the csv file.
        const Station_csv_data_validation = csv_station_schema.validate(record)
        if (Station_csv_data_validation.error) {
          //If the data is not valid, then log the error and continue.
          errorLog(
            "Invalid station data found, skipping it:",
            Station_csv_data_validation.error
          )
          continue
        }

        //Translating the data from the csv file to the data format that is easier to use and store in the application.
        const results: Station_data = {
          fid: record.FID,
          station_id: record.ID,
          nimi: record.Nimi,
          namn: record.Namn,
          name: record.Name,
          osoite: record.Osoite,
          adress: record.Adress,
          kaupunki: record.Kaupunki,
          stad: record.Stad,
          operaattor: record.Operaattor,
          kapasiteet: record.Kapasiteet,
          x: Number(record.x),
          y: Number(record.y),
        }

        //save the data to the database
        await save_station_data(results)
      }
    })

    parser.on("end", () => {
      resolve()
    })

    parser.on("skip", (error) => {
      errorLog("Skipping line in csv file due to error :", error.message)
    })

    parser.on("error", (error: any) => {
      errorLog("Parsing error :", error)
    })

    //Read the csv file and pipe it to the parser.
    fs.createReadStream(filePath).pipe(parser)
  })
}

async function save_station_data(data: Station_data) {
  const new_station = new Station(data)
  await new_station.save()
}

export interface Station_query_result {
  stations: Stored_station_data[]
  total_stations: number
  total_pages: number
}

const get_stations_params_schema = Joi.object({
  page: Joi.number().min(0).required(),
  limit: Joi.number().min(1).required(),
  order: Joi.string().allow("asc", "desc").required(),
  sort: Joi.string().optional().required(),
})

export interface Get_stations_query_params {
  page: string | number
  limit: string | number
  order: "asc" | "desc"
  sort: keyof Stored_station_data
}
//Get all stations with pagination
export async function get_stations(
  req: Request<{}, {}, {}, Get_stations_query_params>,
  res: Response
) {
  try {
    let { page, limit, order, sort } = req.query

    //Query params are always strings, so we need to convert them to numbers
    page = parseInt(page as string)
    limit = parseInt(limit as string)

    const params_validation = get_stations_params_schema.validate({
      page,
      limit,
      order,
      sort,
    })

    if (params_validation.error) {
      errorLog("Invalid params :", params_validation.error)
      return res.status(400).json({
        message: "Invalid query params : " + params_validation.error.message,
      })
    }

    const skip = page * limit
    const stations = await Station.find().skip(skip).limit(limit)
    //sort stations by the given sort parameter manually as mongoose sort applies to all documents in the collection,
    //not just the ones that are returned by the query.
    stations.sort((a, b) => {
      //@ts-ignore
      if (a[sort] < b[sort]) {
        return order === "asc" ? -1 : 1
      }
      //@ts-ignore
      if (a[sort] > b[sort]) {
        return order === "asc" ? 1 : -1
      }
      return 0
    })

    const total_stations = await Station.countDocuments()
    const total_pages = Math.ceil(total_stations / limit)

    res.status(200).json({ stations, total_stations, total_pages })
  } catch (error) {
    errorLog("Failed to get stations :", error)
    res.status(500).json({
      message: "Failed to get stations",
    })
  }
}
