import Auth from "./pages/Auth";
import React, { useContext } from 'react'
import { UserContext } from "./userContext";
import Chat from "./components/Chat/Chat";
import ResetPassword from './pages/ResetPassword';
import ResetPasswordVerify from "./pages/ResetPasswordVerify";
import LogoSplash from "./components/LogoSplash";
import Profile from "./pages/Profile";
import {Route, Routes} from "react-router-dom";
import VerifyEmail from "./pages/VerifyEmail";
export default function PageRouter() {
    const { username } = useContext(UserContext);
    const {isFetching} = useContext(UserContext);
    if(isFetching){
        return <LogoSplash/>
    }
    return (
        <Routes>
            <Route path="/" element={username?<Chat/>:<Auth/>}/>
            <Route path="/resetpassword" element={<ResetPassword/>}/>
            <Route path="/resetpassword/verify/:token" element={<ResetPasswordVerify/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/verfiy/email/:token" element={<VerifyEmail/>}/>
        </Routes>
    )
}
