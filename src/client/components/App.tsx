import axios from "axios"
import React, { useEffect } from "react"
import { FC } from "react"

const App: FC = () => {
  const get_data = async () => {
    try {
      const response = await axios.get("/database")
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_data()
  }, [])

  return <h1>Hello, world</h1>
}

export default App
