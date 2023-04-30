import { createContext, useEffect, useState } from "react";
import {publicRequest} from './apiRequestMethods';
export const UserContext = createContext({});
export function UserContextProvider({children}){
    const [username, setUserName] = useState(null);
    const [id, setId] = useState(null);
    const [fullname, setFullName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [email, setEmail] = useState(null);
    useEffect(()=>{
        const fetchUser = async ()=>{
            setIsFetching(true);
            try {
                const res = await publicRequest.get('/auth/profile');
                setId(res.data.id);
                setUserName(res.data.username);
                setFullName(res.data.fullname);
                setAvatar(res.data.avatar);
                setEmail(res.data.email);
            } catch (error) {
                console.log(error);
            }
            setTimeout(()=>setIsFetching(false), 1000);
        }
      fetchUser();
    },[]);
    return (
        <UserContext.Provider value={{username, setUserName, id, setId, isFetching, avatar, setAvatar, fullname, setFullName, email, setEmail}}>
            {children}
        </UserContext.Provider>
    )
}