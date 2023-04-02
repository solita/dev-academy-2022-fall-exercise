import Joi from "joi"
import mongoose from "mongoose"

const journey_schema = new mongoose.Schema({
  departure_date: Date,
  return_date: Date,
  departure_station_id: String,
  departure_station_name: String,
  return_station_id: String,
  return_station_name: String,
  covered_distance: Number,
  duration: Number,
})

export default mongoose.model("Journey", journey_schema)

export const csv_journey_schema = Joi.object({
  Departure: Joi.date().required(),
  Return: Joi.date().required(),
  "Departure station id": Joi.string().required(),
  "Departure station name": Joi.string().required(),
  "Return station id": Joi.string().required(),
  "Return station name": Joi.string().required(),
  "Covered distance (m)": Joi.number().required(),
  "Duration (sec.)": Joi.number().required(),
})
