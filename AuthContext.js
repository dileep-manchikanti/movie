import {auth} from '../firebase';
import { createContext,useContext, useEffect, useState } from 'react';
import {signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged, updatePassword, sendEmailVerification} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const signup = async (email,password,repassword) =>
{
    if(email.split(" ").join("")=='')
    {
        throw new Error("Invalid Email Address");
    }
    else  if(password!=repassword)
    {
        throw new Error("Passwords mismatched");
        
    }
    return createUserWithEmailAndPassword(auth, email, password);
}

const signin = async (email,password) =>
{
    return signInWithEmailAndPassword(auth,email,password);
}

const signout = ()=>
{
    return signOut(auth);
}

export const useAuth = ()=>
{
    return useContext(AuthContext);
}
const AuthContext = createContext();

export default function AuthProvider({children})
{
    const [loading,setLoading] = useState(true);
    const [userid,setUserId] = useState("");
    const [useremail,setUseremail] = useState("");
    const value = {signup,signin,signout,userid,useremail};
    const navigate = useNavigate();
    useEffect(()=>
    {
         const unsubscribe = onAuthStateChanged(auth,(user)=>
         {
             if(user!=null)
             {
                 setUserId(user.uid);
                 setUseremail(user.email);
                 if(!user.emailVerified)
                 {
                     sendEmailVerification(user);
                     signOut(auth);
                 }
                 if(user.emailVerified)
                 {
                  navigate("/dashboard");
                 } 
             }
             else
             {
                 setUserId(null);
                 setUseremail(null);
             }
         });
         return unsubscribe;
    },[]);
    return <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>;
}



