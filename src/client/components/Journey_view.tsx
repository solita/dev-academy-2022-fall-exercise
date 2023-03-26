import React, { useEffect, useState } from "react"
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSearchBar,
  EuiSearchBarProps,
  EuiTableSortingType,
  Pagination,
  Query,
  SearchFilterConfig,
} from "@elastic/eui"
import axios from "axios"
import moment from "moment"
import { uniqBy } from "lodash"
import { Journey_data, Stored_journey_data } from "../../common"
import {
  Get_journeys_query_params,
  Journey_query_result,
} from "../../server/controllers/journey"

const Journey_view = () => {
  const [is_loading, set_is_loading] = useState(false)
  const [journey_data, set_journey_data] = useState<Stored_journey_data[]>([])
  const [sorting, set_sorting] = useState<EuiTableSortingType<Stored_journey_data>>({
    sort: { field: "departure_station_name", direction: "asc" },
  })
  const [search_query, set_search_query] = useState<Query | string>("")
  const [pagination, set_pagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
    totalItemCount: 0,
    pageSizeOptions: [10, 25, 50],
    showPerPageOptions: true,
  })
  const [error, set_error] = useState<string | undefined>(undefined)

  const get_journey_data = async () => {
    set_error(undefined)
    try {
      if (!sorting || !sorting.sort) throw "Sorting is not defined"

      //Sorting needs to be manually controlled while using filters and pagination
      const params: Get_journeys_query_params = {
        page: pagination.pageIndex,
        limit: pagination.pageSize,
        sort: sorting.sort.field,
        order: sorting.sort.direction,
      }
      const response = await axios.get<Journey_query_result>("/journeys", {
        params,
      })
      set_journey_data(response.data.journeys)
      set_pagination({
        ...pagination,
        totalItemCount: response.data.total_journeys,
      })
    } catch (error) {
      set_error(error as string)
      console.error(error)
    }
    set_is_loading(false)
  }

  //Fetch data on page load and when pagination changes
  useEffect(() => {
    set_is_loading(true)
    get_journey_data()
  }, [pagination.pageIndex, pagination.pageSize, sorting])

  //Create filters for the search bar
  const filters: SearchFilterConfig[] = [
    {
      type: "field_value_selection",
      field: "departure_station_name",
      name: "Departure station",
      multiSelect: false,
      //Provide unique options based on departure stations
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
      //Provide unique options based on return stations
      options: uniqBy(journey_data, "return_station_name").map((journey_data) => ({
        value: journey_data.return_station_name,
        view: journey_data.return_station_name,
      })),
    },
  ]

  //Filter the data based on the search query
  const queried_items = EuiSearchBar.Query.execute(search_query, journey_data, {
    defaultFields: ["departure_station_name", "return_station_name", "duration", "covered_distance"],
  })

  const on_search_change: EuiSearchBarProps["onChange"] = ({ query, error }) => {
    if (error) {
      console.error(error)
    } else {
      set_search_query(query)
    }
  }

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
      sortable: true,
      //Display distance in a more readable formate
      render: (covered_distance: number) => {
        if (covered_distance < 1000) {
          return `${covered_distance} m`
        } else {
          return `${(covered_distance / 1000).toFixed(2)} km`
        }
      },
    },
    {
      field: "duration",
      name: "Duration",
      sortable: true,
      //Display duration in a more readable formate
      render: (duration: number) => moment.duration(duration, "seconds").humanize(),
    },
  ]

  return (
    <EuiFlexGroup gutterSize="s" direction="column">
      <EuiFlexItem grow={false}>
        <EuiSearchBar
          box={{
            incremental: true,
          }}
          filters={filters}
          onChange={on_search_change}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiBasicTable
          loading={is_loading}
          error={error}
          items={queried_items}
          columns={columns}
          pagination={pagination}
          onChange={({ page: { index, size }, sort }) => {
            set_pagination({ ...pagination, pageIndex: index, pageSize: size })
            if (sort) {
              set_sorting({ sort: { field: sort.field, direction: sort.direction } })
            }
          }}
          sorting={sorting}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default Journey_view