import React,{createContext,useContext,useEffect,useState} from 'react';
import {api,session,SessionUser} from '../services/api';

type AuthContextValue={user:SessionUser|null;loading:boolean;login:(email:string,password:string,remember:boolean)=>Promise<void>;logout:()=>void};
const AuthContext=createContext<AuthContextValue|undefined>(undefined);
export const SecureAuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [user,setUser]=useState<SessionUser|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{ const token=session.get(); if(!token){setLoading(false);return;} api.me().then(r=>setUser(r.user)).catch(()=>session.clear()).finally(()=>setLoading(false)); },[]);
 const login=async(email:string,password:string,remember:boolean)=>{const r=await api.login(email,password);session.set(r.token,remember);setUser(r.user);};
 const logout=()=>{session.clear();setUser(null);};
 return <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>;
};
export function useSecureAuth(){const v=useContext(AuthContext);if(!v)throw new Error('SecureAuthProvider missing');return v;}
