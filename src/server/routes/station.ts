//Using import syntax instead of require syntax to get typings
import express from "express";
import { get_stations } from "../controllers/station";

const router = express.Router()

//Get all journeys
router.get("/", get_stations)

export default router