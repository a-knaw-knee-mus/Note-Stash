import React, {useContext} from "react"
import axios from 'axios'
import {myContext} from "./Context"
import FlashOnRoundedIcon from '@material-ui/icons/FlashOnRounded';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Navbar, Container, Nav} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function Header(props) {
    const context = useContext(myContext)

    const logout = () => {
        axios.get("https://note-stash-backend.herokuapp.com/auth/logout", {withCredentials: true}).then(res => {
            if (res.data === "done") {
                window.location.href = "/"
            }
        })
    }

    const login = () => {
        window.open("https://note-stash-backend.herokuapp.com/auth/google", "_self")
    }

    return <div>
        <header>
        <Navbar expand="md" style={{fontFamily: "McLaren"}}>
            <Container>
                <Navbar.Brand><FlashOnRoundedIcon fontSize="large" />Note Stash</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                    <Nav>
                        {context ? <img src={context.profilePic} className="profile-pic" alt="profile" /> : <LockOutlinedIcon fontSize="large"/>}
                        <Nav.Link>
                        {!context ? 
                            <div className="remove-link-style" onClick={login}>Register/Login with Google</div> 
                        : 
                            <div className="remove-link-style" onClick={logout} style={{marginTop: "12px"}}>Logout</div>}              
                        </Nav.Link>                   
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </header>
    </div>
}

export default Header