//Using import syntax instead of require syntax to get typings
import express from "express";
import { get_station, get_stations } from "../controllers/station";

const router = express.Router()

//Get all stations
router.get("/", get_stations)

router.get("/:_id", get_station)

export default router