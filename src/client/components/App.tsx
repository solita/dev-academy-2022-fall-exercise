import axios from "axios"
import React, { useEffect } from "react"
import { FC } from "react"
import "@elastic/eui/dist/eui_theme_dark.css"

import { EuiProvider } from "@elastic/eui"
import { Journey_view } from "./Journey_view"

const App: FC = () => {
  return (
    <EuiProvider colorMode="dark">
      <Journey_view />
    </EuiProvider>
  )
}

export default App
