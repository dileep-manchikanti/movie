import {useState} from 'react';
import { Routes ,Route} from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Movie from './Movie';
import DashBoard from './DashBoard';
import  AuthProvider  from './Contexts/AuthContext';
import Profile from './Profile';
export default function App()
{
     return(
       <AuthProvider>
       <Routes>
         <Route exact path='/' element={<SignUp/>}/>
         <Route exact path='/signin' element={<SignIn/>}/>
         <Route exact path='/dashboard' element={<DashBoard/>}/>
         <Route exact path='/movies/:movieId' element={<Movie/>}/>
         <Route exact path='/ProfileSettings/:changeOption' element={<Profile/>}/>
       </Routes>
       </AuthProvider>
     )
}
   