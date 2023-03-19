//Using import syntax instead of require syntax to get typings
import express from "express";
import database_controller from "../controllers/database";

const router = express.Router()

router.get("/", database_controller.get_database)

module.exports = router
