import React from "react"
import App from "../src/client/components/App"
import { screen, render } from "@testing-library/react"

describe("App", () => {
  it("renders", async () => {
    render(<App />)
    const element = await screen.findByTestId("app")
    expect(element).toBeInTheDocument()
  })
})