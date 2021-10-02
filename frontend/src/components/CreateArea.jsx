import React, {useState, useContext, useEffect} from "react";
import axios from 'axios'
import { myContext } from "./Context"
import AddIcon from "@material-ui/icons/Add"
import Fab from "@material-ui/core/Fab"
import Zoom from "@material-ui/core/Zoom"

function CreateArea(props) {
    const context = useContext(myContext)

    const [note, setNote] = useState({
        title: "",
        content: ""
    })

    const [placeholderText, setPlaceholderText] = useState("Sign in to take a note!")

    function handleChange(event) {
        const {name, value} = event.target

        setNote(prevNote => {
            return {
                ...prevNote,
                [name]: value
            }
        })
    }

    function submitNote(event) {  
        event.preventDefault()
        if (note.title.trim() && note.content.trim()) {
            if (note.title.length <= 30 && note.content.length <= 500) {
                props.onAdd(note)
                const params = new URLSearchParams([['title', note.title], ['content', note.content], ['id', context.googleId]]);
                axios.get("https://note-stash-backend.herokuapp.com/addNote", {params}, {withCredentials: true})

                setNote({
                    title: "",
                    content: ""
                })

                document.getElementById("title").focus()
            }
        }     
    }

    useEffect(() => {
        if (context) {
            setPlaceholderText(`Hello ${context.username}! Click to take a note!`)
        }
    }, [context])

    return (
        <form className="create-note">
            <input 
                id="title"
                onClick={() => setPlaceholderText("Title  (30 chars max)")}  
                disabled={!context} 
                onChange={handleChange}
                name="title" 
                placeholder={placeholderText} 
                value={note.title} 
                autoFocus
                autoComplete="off" 
                />
            {placeholderText === "Title  (30 chars max)" && <textarea 
                autoComplete="off"
                onChange={handleChange}  name="content" 
                placeholder="Content (300 chars max)"
                rows="3" 
                value={note.content} />}        
            <Zoom in={placeholderText === "Title  (30 chars max)"}><Fab type="submit" onClick={submitNote}><AddIcon /></Fab></Zoom>
        </form>
    );
}

export default CreateArea