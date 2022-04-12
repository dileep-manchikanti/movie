import {Navbar,Dropdown,Nav} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {useAuth} from './Contexts/AuthContext';
import {BsFillPersonFill} from 'react-icons/bs';
import { useEffect, useState } from 'react';
import {IoMdNotificationsOutline} from 'react-icons/io';
import {AiFillSave} from 'react-icons/ai';
import {auth} from './firebase';
export default function NavBar()
{
    const {signout} = useAuth();
    const navigate = useNavigate();
    return(
        <Navbar sticky="top" style={{ backgroundColor: "#38024f",color:"white",padding: "5px",display:"flex",justifyContent:"space-around"}}>
                    <div style={{display:"flex",alignItems:"center",marginLeft:"10vw"}}>
                    <h1 style={{cursor:"pointer",textAlign:"center",marginRight:"2vw",padding:"1px",width:"4vw",height:"4vw",backgroundColor:"rgba(12, 173, 232,1)",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center"}}
                    onClick={(e)=>{e.preventDefault();navigate("/dashboard");}}>{auth.currentUser.displayName[0]}</h1>
                    <h1>{auth.currentUser.displayName}</h1>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <Dropdown className="drop-down">
                        <Dropdown.Toggle variant="info">
                            <BsFillPersonFill/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e)=>{e.preventDefault();navigate("/ProfileSettings/password");}}>Change Password</Dropdown.Item>
                            <Dropdown.Item onClick={(e)=>{e.preventDefault();navigate("/ProfileSettings/username")}}>Change Username</Dropdown.Item>
                            <Dropdown.Item onClick={async (e)=>{e.preventDefault();await signout();navigate("/");}}>SignOut</Dropdown.Item>
                            <Dropdown.Item onClick={async (e)=>{e.preventDefault();navigate("/ProfileSettings/account");}}>Delete Account</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                </Navbar>
    )
    
}