import React from "react"
import Station_view from "../components/Station_view"
import { screen, render, act, fireEvent, waitFor } from "@testing-library/react"
import { dummy_station_A, dummy_station_B } from "../../__mocks__/data"
import { rest } from "msw"
import server from "../../__mocks__/server"

describe("Station", () => {
  it("Renders", async () => {
    render(<Station_view />)
    const element = await screen.findByTestId("station_table")
    expect(element).toBeInTheDocument()
  })

  it("Displays station data", async () => {
    render(<Station_view />)
    const element = await screen.findByText(dummy_station_A.nimi)
    expect(element).toBeInTheDocument()
  })

  it("Sort station data", async () => {
    //Mock the server response for sorting table items
    //This runtime api will be replaced after the test
    server.use(
      rest.get("http://localhost/stations", (req, res, ctx) => {
        //Get the sort query parameter
        const sort = req.url.searchParams.get("sort")
        const order = req.url.searchParams.get("order")

        expect(sort).toBe("nimi")

        if (order === "asc") {
          return res(
            ctx.json({
              stations: [dummy_station_A, dummy_station_B],
              total_stations: 2,
              total_pages: 1,
            })
          )
        }

        if (order === "desc") {
          return res(
            ctx.json({
              stations: [dummy_station_B, dummy_station_A],
              total_stations: 2,
              total_pages: 1,
            })
          )
        }
      })
    )

    const { container } = render(<Station_view />)
    const column_button = container.querySelector(".euiTableHeaderButton-isSorted")
    if (!column_button) throw new Error("column button not found")

    const table_item = await screen.findByText(dummy_station_A.nimi)

    expect(column_button).toBeInTheDocument()
    expect(table_item).toBeInTheDocument()

    // Get an array of all the table cells in the first column before sorting
    const table_rows = await screen.findAllByRole("cell", {
      name: /.*Finnish Name.*/i,
    })
    const old_order = table_rows.map((row) => row.textContent)

    act(() => {
      fireEvent.click(column_button)
    })

    // Wait for the table to re-render with the sorted data
    await waitFor(() =>
      expect(screen.getByText(dummy_station_A.nimi)).toBeInTheDocument()
    )

    // Get an array of all the table cells in the first column
    //regex to find the string "departure station" in the cell
    const new_table_cells = await screen.findAllByRole("cell", {
      name: /.*Finnish Name.*/i,
    })

    const new_order = new_table_cells.map((row) => row.textContent)

    expect(new_order).not.toEqual(old_order)
  })

  it("Searches", async () => {
    const { container } = render(<Station_view />)
    const search_bar = container.querySelector(".euiFieldSearch")

    if (!search_bar) throw new Error("search bar not found")

    act(() => {
      fireEvent.change(search_bar, {
        target: { value: dummy_station_A.nimi },
      })
    })

    await waitFor(() => {
      expect(screen.getByText(dummy_station_A.nimi)).toBeInTheDocument()
    })

    expect(screen.queryByText(dummy_station_B.nimi)).not.toBeInTheDocument()
  })
})
