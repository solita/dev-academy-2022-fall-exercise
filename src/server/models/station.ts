import Joi from "joi"
import mongoose from "mongoose"

//HSL Station information

const station_schema = new mongoose.Schema({
  fid: String,
  station_id: String,
  nimi: String,
  namn: String,
  name: String,
  osoite: String,
  ddress: String,
  kaupunki: String,
  stad: String,
  operaattor: String,
  kapasiteet: String,
  x: Number,
  y: Number,
})

export default mongoose.model("Station", station_schema)

//FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export const csv_station_schema = Joi.object({
  FID: Joi.string().required(),
  ID: Joi.string().required(),
  Nimi: Joi.string().required(),
  Namn: Joi.string().required(),
  Name: Joi.string().required(),
  Osoite: Joi.string().required(),
  Adress: Joi.string().required(),
  Kaupunki: Joi.string().required(),
  Stad: Joi.string().required(),
  Operaattor: Joi.string().required(),
  Kapasiteet: Joi.string().required(),
  x: Joi.string().required(),
  y: Joi.string().required(),
})
