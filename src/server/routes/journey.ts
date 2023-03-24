//Using import syntax instead of require syntax to get typings
import express from "express";
import { get_journeys } from "../controllers/journey";

const router = express.Router()

//Get all journeys
router.get("/", get_journeys)

export default router
