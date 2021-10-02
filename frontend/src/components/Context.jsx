import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const myContext = createContext({})
function Context(props) {
    const [userObject, setUserObject] = useState()

    useEffect(() => {
        axios.get("https://note-stash-backend.herokuapp.com/getUser", {withCredentials: true}).then(res => {
            if (res.data) {
                setUserObject(res.data)
            }
        }) 
    }, [])
    return (
        <myContext.Provider value={userObject}>{props.children}</myContext.Provider>
    )
}

export default Context