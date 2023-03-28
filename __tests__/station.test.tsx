import React from "react"
import Station_view from "../src/client/components/Station_view"
import { screen, render } from "@testing-library/react"

describe("Station", () => {
  it("renders", async () => {
    render(<Station_view />)
    const element = await screen.findByTestId("station_table")
    expect(element).toBeInTheDocument()
  })
})