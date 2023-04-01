import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import mongoose from "mongoose"

import app_router from "./routes/app"
import journey_router from "./routes/journey"
import station_router from "./routes/station"
import { initialize_config_collection } from "./models/config"
import {
  clear_journeys,
  import_journey_csv_to_database,
} from "./controllers/journey"

import debug from "debug"
import { csv_data_is_loaded } from "./controllers/config"
import {
  clear_stations,
  import_stations_csv_to_database,
} from "./controllers/station"
const debugLog = debug("app:server:log")
const errorLog = debug("app:server:error")

const app = express()
debugLog("Starting the server")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../../", "public")))

app.use("/", app_router)
app.use("/journeys", journey_router)
app.use("/stations", station_router)

//Initialize the database and import csv data if it has not been imported yet.
//The datasets will be saved within the repo to ensure that the app will always have data to work with.
//Incase the HSL server is down or the data is not available, the app will still work.`
async function start_database() {
  debugLog("Connecting to database")

  await mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017")

  try {
    debugLog("Initializing the database")
    const config = await initialize_config_collection()
    if (!config.csv_data_is_loaded) {
      await clear_journeys()
      import_journey_csv_to_database()

      await clear_stations()
      import_stations_csv_to_database()

      await csv_data_is_loaded()
      debugLog("Database initialized")
    } else {
      debugLog("Database has already been initialized, continuing")
    }
  } catch (error) {
    errorLog(error)
  }
}

if (process.env.NODE_ENV === "test") {
  debugLog("Running in test mode, prevent app from connecting to database")
} else {
  start_database()
}

module.exports = app
