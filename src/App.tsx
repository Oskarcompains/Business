/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { AppProvider } from './context/AppContext';
import { SecureAuthProvider } from './context/SecureAuthContext';
import { Layout } from './components/layout/Layout';
import { SetupAdminView } from './components/auth/SetupAdminView';

export default function App(){
 if(window.location.pathname==='/setup-admin') return <SetupAdminView/>;
 return <SecureAuthProvider><AppProvider><Layout /></AppProvider></SecureAuthProvider>;
}
