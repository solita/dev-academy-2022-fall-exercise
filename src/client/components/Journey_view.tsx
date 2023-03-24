import React, { useEffect, useState } from "react"
import { EuiBasicTableColumn, EuiInMemoryTable } from "@elastic/eui"
import axios from "axios"
import moment from "moment"
import { uniqBy } from "lodash"
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
      field: "departure_station_name",
      name: "Departure station",
      sortable: true,
    },
    {
      field: "return_station_name",
      name: "Return station",
      sortable: true,
    },
    {
      field: "covered_distance",
      name: "Covered distance",
      //Display distance in a more readable formate
      render: (covered_distance: number) => {
        if (covered_distance < 1000) {
          return `${covered_distance} m`
        } else {
          return `${(covered_distance / 1000).toFixed(2)} km`
        }
      },
      sortable: true,
    },
    {
      field: "duration",
      name: "Duration",
      render: (duration: number) => moment.duration(duration, "seconds").humanize(),
      sortable: true,
    },
  ]

  return (
    <EuiInMemoryTable
      items={journey_data}
      columns={columns}
      pagination={true}
      //declaring these props in the component as EUI does not provide types for them.
      //making it hard to define them outside the component
      search={{
        box: {
          incremental: true,
        },
        filters: [
          {
            type: "field_value_selection",
            field: "departure_station_name",
            name: "Departure station",
            multiSelect: false,
            options: uniqBy(journey_data, "departure_station_name").map(
              (journey_data) => ({
                value: journey_data.departure_station_name,
                view: journey_data.departure_station_name,
              })
            ),
          },
          {
            type: "field_value_selection",
            field: "return_station_name",
            name: "Return station",
            multiSelect: false,
            options: uniqBy(journey_data, "return_station_name").map(
              (journey_data) => ({
                value: journey_data.return_station_name,
                view: journey_data.return_station_name,
              })
            ),
          },
        ],
      }}
      sorting={{
        sort: {
          field: "id",
          direction: "desc",
        },
      }}
    />
  )
}
