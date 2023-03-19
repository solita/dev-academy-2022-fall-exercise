import { Request, Response } from "express"
import path from "path"
import { Journey_csv_data, Journey_data } from "../../common"
import csv from "csv-parser"
import fs from "fs"

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
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: Journey_csv_data) => {
        const {
          Departure: departure_date,
          Return: return_data,
          "Covered distance (m)": covered_distance,
          "Duration (sec.)": duration,
        } = data
        console.log(Object.keys(data))
        console.log(departure_date, return_data, covered_distance, duration)
      })
      .on("end", () => {
        resolve(results)
      })
      .on("error", (error: any) => {
        reject(error)
      })
  })
}

export default {
  get_database,
}
