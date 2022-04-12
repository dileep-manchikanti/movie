import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {Container,Form,Button} from 'react-bootstrap';
import {auth} from './firebase';
import {useState,useEffect, useRef} from 'react';
import {AiFillHome} from 'react-icons/ai';
import {deletePostsByUser,deleteCommentsByUser,deleteLikesByUser,deleteSubscriptionsByUser,deleteSavedPostsByUser} from './Data';
import {onAuthStateChanged, reauthenticateWithCredential, updatePassword,EmailAuthProvider, deleteUser, updateProfile} from 'firebase/auth';
export default function Profile()
{
    const {changeOption} = useParams();
    const oldpasswordref = useRef();
    const newpasswordref = useRef();
    const usernameref = useRef();
    const user = auth.currentUser;
    const [passwordchanged,setPasswordChanged] = useState(false);
    const [deletedAccount,setDeletedAccount] = useState(false);
    const [usernamechanged,setUsernamechanged] = useState(false);
    const [error,setError]  = useState("");
    const navigate  = useNavigate();
    if(!user && !deletedAccount)
    {
        return <h1 style={{ textAlign: "center" }}>SignIn to Access this Page</h1>
    }
    const changePassword=async (e)=>
    {
        e.preventDefault();
        try
        {
         const credential = EmailAuthProvider.credential(
            user.email, 
            oldpasswordref.current.value
         );
         await reauthenticateWithCredential(user,credential);
         await updatePassword(user,newpasswordref.current.value);
         setPasswordChanged(true);
        }
        catch(err)
        {
            setError(err.message);
        }
    }
    const changeUserName=async (e)=>
    {
        e.preventDefault();
        updateProfile(auth.currentUser,{displayName:usernameref.current.value});
        setUsernamechanged(true);
    }
    const deleteAccount=async (e)=>
    {
        e.preventDefault();
        try
        {
         const credential = EmailAuthProvider.credential(
            user.email, 
            oldpasswordref.current.value
         );
         await deletePostsByUser(user.email);
         await deleteLikesByUser(user.uid);
         await deleteCommentsByUser(user.email);
         await reauthenticateWithCredential(user,credential);
         await deleteUser(user);
         setDeletedAccount(true);
         }
         catch(err)
         {
             setError(err.message);
         }
    }
    if(changeOption=="password")
    {
       return(
        !passwordchanged ? <Container style={{}}>
            <h3>Profile Settings</h3>
            <Form>
            <Form.Group style={{marginTop:"2vw",marginBottom:"2vw"}}>
                   <label htmlFor="password">Enter Old Password</label>
                   <Form.Control ref={oldpasswordref} type="password" name="password"></Form.Control>
               </Form.Group>
               <Form.Group style={{marginTop:"2vw"}}>
                   <label htmlFor="password">Enter New Password</label>
                   <Form.Control ref={newpasswordref} type="password" name="password"></Form.Control>
               </Form.Group>
               <Button style={{marginTop:"2vw"}} onClick={changePassword}>Change Password</Button>
            </Form>
            {
              error.length!=0 && <h3 style={{backgroundColor:"#f2888b",padding:"0.2vw",borderRadius:"4px",marginTop:"4vw",padding:'1vw'}}>{error}</h3>
            }
        </Container> 
        : <h3 style={{backgroundColor:"#56d696",padding:"2vw",borderRadius:"4px"}} className='loading'>Successfully Changed Your Password</h3>
    )
    }
    else if(changeOption=='username')
    {
        return(
            !usernamechanged ? 
            <Container>
                <h3>Profile Settings</h3>
                <Form>
                   <Form.Group style={{marginTop:"2vw"}}>
                       <label htmlFor="username">Enter Username</label>
                       <Form.Control type="text" name="username" ref={usernameref}></Form.Control>
                   </Form.Group>
                </Form>
               <Button style={{marginTop:"2vw"}} onClick={changeUserName}>Change Username</Button>
            </Container> : <h3 style={{backgroundColor:"#56d696",padding:"2vw",borderRadius:"4px"}} className='loading'>Successfully Changed Your Username</h3>
        );
    }
    else
    {
        return(
            !deletedAccount ? 
            <Container>
                <Form>
                    <h3>Profile Settings</h3>
                    <Form.Group style={{marginTop:"2vw",marginBottom:"2vw"}}>
                   <label htmlFor="password">Enter Password</label>
                   <Form.Control ref={oldpasswordref} type="password" name="password"></Form.Control>
                   </Form.Group>
                   <Button variant="danger" onClick={deleteAccount} style={{marginTop:"2vw"}}>Delete Account</Button>
                </Form>
                {
              error.length!=0 && <h3 style={{backgroundColor:"#f2888b",padding:"0.2vw",borderRadius:"4px",marginTop:"4vw",padding:'1vw'}}>{error}</h3>
            }               
           </Container> : 
           <>
           <h3 style={{backgroundColor:"#56d696",padding:"2vw",borderRadius:"4px"}} className='loading'>Successfully Deleted Your Account</h3>
           <AiFillHome onClick={(e)=>{navigate("/");}} className='enlarge-icons loading' style={{top:"60%",left:"50%"}}/>
           </>
        )
    }
}