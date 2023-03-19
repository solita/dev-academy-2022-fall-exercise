import React from "react"
import { createRoot } from "react-dom/client"
import App from "./components/App"

const root_element = document.getElementById("root")
if (!root_element) {
  throw new Error("Root element not found")
}

const root = createRoot(root_element)
root.render(<App />)
