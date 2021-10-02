import React from "react"
import reactDOM from "react-dom"
import App from "./components/App"
import Context from "./components/Context"

reactDOM.render(
    <Context>
        <App />
    </Context>, 
    document.getElementById("root")
)