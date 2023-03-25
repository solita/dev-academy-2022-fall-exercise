import axios from "axios"
import React, { useEffect } from "react"
import { FC } from "react"
import "@elastic/eui/dist/eui_theme_dark.css"

import { EuiPage, EuiPageBody, EuiProvider } from "@elastic/eui"
import { Journey_view } from "./Journey_view"

const App: FC = () => {
  return (
    <EuiProvider colorMode="dark">
      <EuiPage>
        <EuiPageBody>
          <Journey_view />
        </EuiPageBody>
      </EuiPage>
    </EuiProvider>
  )
}

export default App
