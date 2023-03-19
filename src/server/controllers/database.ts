import { Request, Response } from "express"
import path from "path"
const fs = require("fs").promises

const get_database = async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "../../../", "datasets", "2021-05.csv"))
    res.send(data)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

export default {
  get_database,
}
