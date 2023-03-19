const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")

const app_router = require("./src/server/routes/app")
const database_router = require("./src/server/routes/database")

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", app_router)
app.use("/database", database_router)

module.exports = app
