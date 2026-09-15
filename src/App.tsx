/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { AppProvider } from './context/AppContext';
import { SecureAuthProvider } from './context/SecureAuthContext';
import { Layout } from './components/layout/Layout';

export default function App(){
 return <SecureAuthProvider><AppProvider><Layout /></AppProvider></SecureAuthProvider>;
}
