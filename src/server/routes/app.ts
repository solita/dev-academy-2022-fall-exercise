//Using import syntax allows typings from express
import express from "express";
const router = express.Router()

/* GET home page. */
router.get("/", (req, res, next) => {
  res.sendFile("index.html", { root: "public" })
})

export default router
