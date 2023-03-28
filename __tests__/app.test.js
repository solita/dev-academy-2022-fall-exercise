import React from "react"
import Journey_view from "../src/client/components/Journey_view"
import App from "../src/client/components/App"
import { screen, render } from "@testing-library/react"
import Station_view from "../src/client/components/Station_view"

describe("App", () => {
  it("renders", async () => {
    render(<App />)
    const element = await screen.findByTestId("app")
    expect(element).toBeInTheDocument()
  })
})

describe("Journey", () => {
  it("renders", async () => {
    render(<Journey_view />)
    const element = await screen.findByTestId("journey_table")
    expect(element).toBeInTheDocument()
  })
})

describe("Station", () => {
  it("renders", async () => {
    render(<Station_view />)
    const element = await screen.findByTestId("station_table")
    expect(element).toBeInTheDocument()
  })
})
