import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import mongoose from "mongoose"

import app_router from "./routes/app"
import journey_router from "./routes/journey"
import { initialize_config_collection } from "./models/config"
import { clear_journeys, import_datasets_to_database } from "./controllers/journey"

import debug from "debug"
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
app.use("/journey", journey_router)

//Initialize the database and import csv data if it has not been imported yet.
async function start_database() {
  debugLog("Connecting to database")
  await mongoose.connect("mongodb://mongo:27017")

  try {
    debugLog("Initializing the database")
    const config = await initialize_config_collection()
    if (!config.csv_data_is_loaded) {
      await clear_journeys()
      await import_datasets_to_database()
    }
    debugLog("Database initialized")
  } catch (error) {
    errorLog(error)
  }
}
start_database()

module.exports = app
