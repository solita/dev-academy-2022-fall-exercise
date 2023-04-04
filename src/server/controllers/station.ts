import path from "path"
import { parse } from "csv-parse"
import fs from "fs"
import { csv_station_schema } from "../models/station"
import Station from "../models/station"
import Journey from "../models/journey"
import { csv_data_is_loaded } from "./config"
import {
  Station_csv_data,
  Station_data,
  Stored_journey_data,
  Stored_station_data,
} from "../../common"
import { Request, Response } from "express"

import debug from "debug"
import Joi from "joi"
import { PipelineStage } from "mongoose"
import moment from "moment"
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
      await read_csv_station_data(csv_file_path)
    }
    debugLog("All station csv files imported to the database")
    return csv_data_is_loaded()
  } catch (error) {
    errorLog("Failed to import csv datasets to database :", error)
    throw error
  }
}

export function read_csv_station_data(filePath: string): Promise<void> {
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

export async function save_station_data(data: Station_data) {
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
  order: Joi.string().valid("asc", "desc").required(),
  sort: Joi.string().valid("nimi", "namn", "osoite", "kapasiteet").required(),
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
    //sort journeys by the given sort parameter manually,
    //as mongoose sort() applies to all documents in the collection,
    //not just the ones that are returned by the query.
    stations.sort((a, b) => {
      //@ts-ignore - sort will always be a valid key
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

export const get_station = async (req: Request<{ _id: string }>, res: Response) => {
  try {
    const station = await Station.findById(req.params._id)
    if (!station) {
      return res.status(404).json({
        message: "Station not found",
      })
    }
    res.status(200).json(station)
  } catch (error) {
    errorLog("Failed to get station :", error)
    res.status(500).json({
      message: "Failed to get station",
    })
  }
}

export interface Station_stats {
  //Total number of journeys starting from the station
  total_journeys_started: number
  //Total number of journeys ending at the station
  total_journeys_ended: number
  // //The average distance of a journey starting from the station
  average_distance_started: number
  // //The average distance of a journey ending at the station
  average_distance_ended: number
  //Top 5 most popular return stations for journeys starting from the station
  top_5_return_stations: Stored_station_data[]
  //Top 5 most popular departure stations for journeys ending at the station
  top_5_departure_stations: Stored_station_data[]
}

export interface Get_station_stats_query_params extends Partial<Time_filter> {}

export const get_station_stats = async (
  req: Request<{ _id: string }, {}, {}, Time_filter | undefined>,
  res: Response<Station_stats | { message: string }>
) => {
  const { _id } = req.params
  const time_filter = req.query
  debugLog("time_filter", time_filter)

  const station = await Station.findById(_id)
  if (!station || !station.station_id) {
    return res.status(404).json({
      message: "Station not found",
    })
  }

  const total_journeys_started = await Journey.find({
    departure_date: {
      $gte: time_filter?.start_date || new Date(0),
      $lte: time_filter?.end_date || new Date(),
    },
  }).countDocuments({
    departure_station_id: station.station_id,
  })
  const total_journeys_ended = await Journey.find({
    departure_date: {
      $gte: time_filter?.start_date || new Date(0),
      $lte: time_filter?.end_date || new Date(),
    },
  }).countDocuments({
    return_station_id: station.station_id,
  })

  const average_distance_started = await get_average_distance_started(
    station.station_id,
    time_filter
  )
  const average_distance_ended = await get_average_distance_ended(station.station_id, time_filter)

  const top_5_return_stations = await get_top_5_return_stations(
    station.station_id,
    time_filter
  )

  const top_5_departure_stations = await get_top_5_departure_stations(
    station.station_id,
    time_filter
  )

  const response_data: Station_stats = {
    total_journeys_started,
    total_journeys_ended,
    average_distance_started: average_distance_started[0]?.average_distance ?? 0,
    average_distance_ended: average_distance_ended[0]?.average_distance ?? 0,
    top_5_return_stations: top_5_return_stations.map(
      (station) => station.station_data[0]
    ),
    top_5_departure_stations: top_5_departure_stations.map(
      (station) => station.station_data[0]
    ),
  }

  return res.status(200).json(response_data)
}

export interface Top_stations {
  _id: string
  count: number
  station_data: Stored_station_data[]
}

export interface Time_filter {
  start_date: string
  end_date: string
}

//Top 5 most popular return stations for journeys starting from the station
export const get_top_5_return_stations = async (
  station_doc_id: string,
  time_filter: Time_filter | undefined
) => {
  debugLog("Getting top 5 return stations for station :", station_doc_id)
  return Journey.aggregate<Top_stations>([
    {
      //Find all journeys that have the same departure station id as the given station id
      $match: {
        departure_station_id: station_doc_id,
        departure_date: {
          $gte: time_filter ? new Date(time_filter.start_date) : new Date(0),
          $lte: time_filter ? new Date(time_filter.end_date) : new Date(),
        },
      },
    },
    {
      //Group journeys by their return station id and get a count
      $group: {
        _id: "$return_station_id",
        count: { $sum: 1 },
      },
    },
    {
      //Sort that group by the count in descending order
      $sort: {
        count: -1,
      },
    },
    {
      //The Journeys with the highest count will be at the top of the array
      $limit: 5,
    },
    {
      //Get the return station data for each of the top 5 return stations
      $lookup: {
        from: "stations",
        localField: "_id",
        foreignField: "station_id",
        as: "station_data",
      },
    },
  ])
}

//Top 5 most popular departure stations for journeys ending at the station
export const get_top_5_departure_stations = async (
  station_doc_id: string,
  time_filter: Time_filter | undefined
) => {
  debugLog("Getting top 5 departure stations for station :", station_doc_id)
  return Journey.aggregate<Top_stations>([
    {
      $match: {
        return_station_id: station_doc_id,
        departure_date: {
          $gte: time_filter ? new Date(time_filter.start_date) : new Date(0),
          $lte: time_filter ? new Date(time_filter.end_date) : new Date(),
        },
      },
    },
    {
      $group: {
        _id: "$departure_station_id",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "stations",
        localField: "_id",
        foreignField: "station_id",
        as: "station_data",
      },
    },
  ])
}

//The average distance of a journey starting from the station
type average_distance = { average_distance: number }
export const get_average_distance_started = async (
  station_doc_id: string,
  time_filter: Time_filter | undefined
) => {
  debugLog("Getting average distance started for station :", station_doc_id)
  return Journey.aggregate<average_distance>([
    {
      $match: {
        departure_station_id: station_doc_id,
        departure_date: {
          $gte: time_filter ? new Date(time_filter.start_date) : new Date(0),
          $lte: time_filter ? new Date(time_filter.end_date) : new Date(),
        },
      },
    },
    {
      $group: {
        _id: null,
        average_distance: { $avg: "$covered_distance" },
      },
    },
  ])
}

//The average distance of a journey ending at the station
export const get_average_distance_ended = async (
  station_doc_id: string,
  time_filter: Time_filter | undefined
) => {
  debugLog("Getting average distance ended for station :", station_doc_id)
  return Journey.aggregate<average_distance>([
    {
      $match: {
        return_station_id: station_doc_id,
        departure_date: {
          $gte: time_filter ? new Date(time_filter.start_date) : new Date(0),
          $lte: time_filter ? new Date(time_filter.end_date) : new Date(),
        },
      },
    },
    {
      $group: {
        _id: null,
        average_distance: { $avg: "$covered_distance" },
      },
    },
  ])
}