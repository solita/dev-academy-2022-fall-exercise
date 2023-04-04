import Config from "../models/config"

import debug from "debug"
const debugLog = debug("app:Config_controller:log")
const errorLog = debug("app:Config_controller:error")

export async function csv_data_is_loaded() {
  debugLog("Updating csv_data_is_loaded to true")
  return Config.updateOne({}, { csv_data_is_loaded: true })
}
