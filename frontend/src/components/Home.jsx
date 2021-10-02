import React, {useState,useContext, useEffect} from "react"
import axios from 'axios'
import { myContext } from "./Context"
import CreateArea from "./CreateArea"
import Note from "./Note"

function Home(props) {
    const context = useContext(myContext)
    const [notes, setNotes] = useState([]);
    
    function addNote(newNote) {
        setNotes(prevNotes => {
            return [...prevNotes, newNote]
        });
    }

    function deleteNote(id) {
        const params = new URLSearchParams([['noteId', id], ['userId', context.googleId]])
        axios.get("https://note-stash-backend.herokuapp.com/deleteNote", {params}, {withCredentials: true}).then(response => {
            retrieveNotes()
        })
    }

    function retrieveNotes() {
        const params = new URLSearchParams([['id', context.googleId]]);
        axios.get("https://note-stash-backend.herokuapp.com/retrieveNotes", {params}, {withCredentials: true}).then(res => {
            setNotes(res.data)
        })
    }

    useEffect(() => context && retrieveNotes())

    return (
        <div>
            <CreateArea signedin={props.signedin} onAdd={addNote} />
            {notes.map((noteItem, index) => {
                return <Note key={index} id={noteItem._id} onDelete={deleteNote} title={noteItem.title} content={noteItem.content} />
            })}
        </div>      
    )  
}

export default Home