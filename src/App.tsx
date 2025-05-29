import React from 'react';
import './App.css';
import NavB from './components/NavBar/NavB';
import { UserConsole } from './components/Users/UserConsole';
import { ItemConsole } from './components/Items/ItemConsole';
import { BrowserRouter, Route, Routes } from 'react-router';
import NotFound from './components/Common/NotFound';
import { ItemTypeProvider } from './components/NavBar/ItemTypeContext'; 
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';
import { AuthProvider, useAuth } from './components/Auth/AuthProvider';
import { RequestConsole } from './components/Requests/RequestConsole';

// Create a separate component to access the auth context
function AppRoutes() {
  const { userRole } = useAuth();

  return (
    <>
      <NavB/>
      <Routes>
        <Route path='/' element={<SignIn/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/requests' element={userRole === 'ROLE_USER' ?
          <>
            <RequestConsole />
          </>
          :(
            <>
            <RequestConsole />
            <ItemConsole />
          </>
          )}/>
        <Route path='/items' element={<ItemConsole/>}/>
        <Route path='/users' element={<UserConsole/>}/>
        <Route path='/*' element={<NotFound/>}/>
      </Routes>
    </>
  );
}

function App() {
  return (
    <ItemTypeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ItemTypeProvider>
  );
}

export default App;