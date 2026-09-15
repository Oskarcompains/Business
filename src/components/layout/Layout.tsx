import React from 'react';
import { useApp } from '../../context/AppContext';
import { useSecureAuth } from '../../context/SecureAuthContext';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { MobileNav } from '../common/MobileNav';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { SecureLoginView } from '../auth/SecureLoginView';
import { SecureAdminView } from '../admin/SecureAdminView';
import { DirectoryView } from '../directory/DirectoryView';
import { EventsView } from '../events/EventsView';
import { EventCheckInView } from '../events/EventCheckInView';
import { UsersView } from '../users/UsersView';

export const Layout:React.FC=()=>{
 const {activeView}=useApp(); const {user,loading}=useSecureAuth();
 if(loading)return <div className="min-h-screen bg-[#070d1e] text-white flex items-center justify-center">Cargando…</div>;
 if(!user)return <SecureLoginView/>;
 const renderView=()=>{switch(activeView){case 'admin':return <SecureAdminView/>;case 'companies':case 'directory':return <DirectoryView/>;case 'events':return <EventsView/>;case 'checkin':return <EventCheckInView/>;case 'users':return <UsersView/>;default:return <DirectoryView/>;}};
 return <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col antialiased selection:bg-red-600 selection:text-white"><OfflineIndicator/><Header/><div className="flex-1 flex w-full max-w-7xl mx-auto"><Sidebar/><main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 md:pb-8">{renderView()}</main></div><MobileNav/></div>;
};
