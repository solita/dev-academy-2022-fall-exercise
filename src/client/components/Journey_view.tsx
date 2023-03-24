import { EuiBasicTableColumn, EuiInMemoryTable } from "@elastic/eui"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Journey_data } from "../../common"

export const Journey_view = () => {
  const [journey_data, set_journey_data] = useState<Journey_data[]>([])

  const get_journey_data = async () => {
    try {
      const response = await axios.get("/journeys")
      set_journey_data(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_journey_data()
  }, [])

  const columns: EuiBasicTableColumn<Journey_data>[] = [
    {
      field: "departure_date",
      name: "Departure date",
      sortable: true,
    },
    {
      field: "departure_station_name",
      name: "Departure station",
      sortable: true,
    },
    {
      field: "return_date",
      name: "Return date",
      sortable: true,
    },
    {
      field: "return_station_name",
      name: "Return station",
      sortable: true,
    },
    {
      field: "covered_distance",
      name: "Covered distance (m)",
      sortable: true,
    },
    {
      field: "duration",
      name: "Duration (sec.)",
      sortable: true,
    },
  ]

  return (
    <EuiInMemoryTable
      items={journey_data}
      columns={columns}
      pagination={true}
      sorting={{
        sort: {
          field: "id",
          direction: "desc",
        },
      }}
    />
  )
}
