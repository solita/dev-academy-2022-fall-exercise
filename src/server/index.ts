import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"

import app_router from "./routes/app"
import journey_router from "./routes/journey"

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../../", "public")))

app.use("/", app_router)
app.use("/database", journey_router)

module.exports = app
