import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import { screen, render, fireEvent, waitFor, act } from "@testing-library/react"
import { dummy_journey_A, dummy_journey_B } from "../__mocks__/data"
import server from "__mocks__/server"
import { rest } from "msw"

describe("Journey", () => {
  it("Renders", async () => {
    render(<Journey_view />)
    const element = await screen.findByTestId("journey_table")
    expect(element).toBeInTheDocument()
  })

  it("Displays journey data", async () => {
    render(<Journey_view />)
    const element = await screen.findByText(dummy_journey_A.departure_station_name)
    expect(element).toBeInTheDocument()
  })

  it("Sort journey data", async () => {
    //mock the server response for sorting table items
    server.use(
      rest.get("http://localhost/journeys", (req, res, ctx) => {
        //Get the sort query parameter
        const sort = req.url.searchParams.get("sort")
        const order = req.url.searchParams.get("order")

        expect(sort).toBe("departure_station_name")

        if (sort === "departure_station_name" && order === "asc") {
          return res(
            ctx.json({
              journeys: [dummy_journey_A, dummy_journey_B],
              total_journeys: 2,
              total_pages: 1,
            })
          )
        }

        if (sort === "departure_station_name" && order === "desc") {
          return res(
            ctx.json({
              journeys: [dummy_journey_B, dummy_journey_A],
              total_journeys: 2,
              total_pages: 1,
            })
          )
        }
      })
    )

    const { container } = render(<Journey_view />)
    const column_button = container.querySelector(".euiTableHeaderButton-isSorted")
    if (!column_button) throw new Error("column button not found")

    const table_item = await screen.findByText(
      dummy_journey_A.departure_station_name
    )

    expect(column_button).toBeInTheDocument()
    expect(table_item).toBeInTheDocument()

    // Get an array of all the table cells in the first column before sorting
    const table_rows = await screen.findAllByRole("cell", {
      name: /.*Departure station.*/i,
    })
    const old_order = table_rows.map((row) => row.textContent)

    console.log("current order", old_order)

    act(() => {
      console.log("button", column_button.textContent)
      fireEvent.click(column_button)
    })

    // Wait for the table to re-render with the sorted data
    await waitFor(() =>
      expect(
        screen.getByText(dummy_journey_A.departure_station_name)
      ).toBeInTheDocument()
    )

    // Get an array of all the table cells in the first column
    //regex to find the string "departure station" in the cell
    const new_table_cells = await screen.findAllByRole("cell", {
      name: /.*Departure station.*/i,
    })

    const new_order = new_table_cells.map((row) => row.textContent)

    console.log("new order", new_order)

    expect(new_order).not.toEqual(old_order)
    server.resetHandlers()
  })
})
