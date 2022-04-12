import {Form,Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useEffect, useRef,useState} from 'react';
import {useAuth} from './Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {signInWithEmailLink,isSignInWithEmailLink,onAuthStateChanged, updateProfile} from 'firebase/auth';
import {auth} from './firebase';
export default function SignUp()
{
    const usernameref = useRef();
    const emailAddressref = useRef();
    const passwordref = useRef();
    const repasswordref = useRef();
    const {signup,userid,useremail} = useAuth();
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const [verification,setVerification] = useState();
    const submitHandler =async (e)=>
    {
        if(verification){return;}
        e.preventDefault();
        try
        {
            await signup(emailAddressref.current.value,passwordref.current.value,repasswordref.current.value);
            await updateProfile(auth.currentUser,{displayName:usernameref.current.value});
            setVerification(true);
        }
        catch(err)
        {
             setError(err.message);
             usernameref.current.value='';
             emailAddressref.current.value='';
             passwordref.current.value='';
             repasswordref.current.value='';
        }
    }
    const checkError = ()=>{return error.length!=0 ? "red" : "black"};
    return(
        <div className="container">
            <h1>SignUp</h1>
            <Form style={{padding:"2vw",width:"50%",border:"2px solid rgba(12, 173, 232,1)",borderColor:checkError(),borderRadius:"4px"}}>
                <Form.Group className='m-3'>
                    <label htmlFor="usrname">User Name</label>
                    <Form.Control ref={usernameref} type="text" name="usrname" autoComplete='off'/>
                </Form.Group>
                <Form.Group className='m-3'>
                    <label htmlFor="email">Email Address</label>
                    <Form.Control type="email" ref={emailAddressref} name="email" autoComplete='off'/>
                </Form.Group>
                <Form.Group className='m-3'>
                    <label htmlFor="pss">Password</label>
                    <Form.Control type="password" name="pss" ref={passwordref} autoComplete='off'/>
                </Form.Group>
                <Form.Group className='m-3'>
                    <label htmlFor="rpss">Confirm Password</label>
                    <Form.Control type="password" name="rpss" ref={repasswordref} autoComplete='off'/>
                </Form.Group>
                {
                    verification && <Form.Group style={{textAlign:"center",backgroundColor:"#8febb8",padding:"2px",borderRadius:"4px"}}><h5>Check your Inbox.</h5></Form.Group>
                }
                <Button className='m-3' onClick={submitHandler}>SignUp</Button>
            </Form>
            <p>Already Have an Account ? <Link to='/signin'>SignIn</Link></p>
            {
                error.length!=0 && 
                <h4 style={{textAlign:"center",backgroundColor:"#f2888b",padding:"1vw",borderRadius:"4px"}}>{error}</h4>
            }
        </div>
    )
}