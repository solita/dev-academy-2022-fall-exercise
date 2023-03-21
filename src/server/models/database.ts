import Joi from "joi"

export const csv_database_schema = Joi.object({
  Departure: Joi.string().required(),
  Return: Joi.string().required(),
  "Departure station id": Joi.string().required(),
  "Departure station name": Joi.string().required(),
  "Return station id": Joi.string().required(),
  "Return station name": Joi.string().required(),
  "Covered distance (m)": Joi.string().required(),
  "Duration (sec.)": Joi.string().required(),
})
