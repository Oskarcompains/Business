export type SessionUser = { id:number; email:string; displayName:string; role:'SUPERADMIN'|'ADMIN'|'MIEMBRO'; status:string; membershipTier?:'ORO'|'PLATA'|'BRONCE'|null; companyId?:number|null };

const TOKEN_KEY='ibc_session_token';
export const session={
  get:()=>sessionStorage.getItem(TOKEN_KEY)||localStorage.getItem(TOKEN_KEY),
  set:(token:string,remember:boolean)=>{ sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY); (remember?localStorage:sessionStorage).setItem(TOKEN_KEY,token); },
  clear:()=>{sessionStorage.removeItem(TOKEN_KEY);localStorage.removeItem(TOKEN_KEY);}
};

async function request<T>(url:string, options:RequestInit={}):Promise<T>{
  const token=session.get();
  const res=await fetch(url,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{ }),...(options.headers||{})}});
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||'Error de servidor');
  return data as T;
}

export const api={
  login:(email:string,password:string)=>request<{token:string;user:SessionUser}>('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  me:()=>request<{user:SessionUser}>('/api/auth/me'),
  apply:(body:any)=>request<{id:number;status:string}>('/api/membership-applications',{method:'POST',body:JSON.stringify(body)}),
  applications:()=>request<{applications:any[]}>('/api/admin/applications'),
  companies:()=>request<{companies:any[]}>('/api/admin/companies'),
  users:()=>request<{users:any[]}>('/api/admin/users'),
  review:(id:number,status:string,assignedTier?:string)=>request<{ok:boolean}>(`/api/admin/applications/${id}`,{method:'PATCH',body:JSON.stringify({status,assignedTier})}),
  updateUser:(id:number,body:any)=>request<{ok:boolean}>(`/api/admin/users/${id}`,{method:'PATCH',body:JSON.stringify(body)})
};
