import axios from "axios"
import React, { useEffect, useState } from "react"
import { Journey_data } from "../../common"

export const Journey_view = () => {
  const [journey_data, set_journey_data] = useState<Journey_data[]>([])

  const get_journey_data = async () => {
    try {
      const response = await axios.get("/database")
      set_journey_data(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_journey_data()
  }, [])

  return <div>Dataset Display</div>
}
