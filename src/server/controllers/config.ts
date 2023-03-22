import Config from "../models/config"

//Set the config collection is loaded to true
export async function csv_data_is_loaded() {
  return Config.updateOne({}, { csv_data_is_loaded: true })
}
