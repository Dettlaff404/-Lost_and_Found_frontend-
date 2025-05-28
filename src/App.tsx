import React from 'react';
import './App.css';
import NavB from './components/NavBar/NavB';
import { RequestConsole } from './components/Requests/RequestConsole';
import { UserConsole } from './components/Users/UserConsole';
import { ItemConsole } from './components/Items/ItemConsole';
import { BrowserRouter, Route, Routes } from 'react-router';
import NotFound from './components/Common/NotFound';
import { ItemTypeProvider } from './components/NavBar/ItemTypeContext'; 
import { SignIn } from './components/Auth/SignIn';
import { SignUp } from './components/Auth/SignUp';

function App() {
  return (
    <ItemTypeProvider>
      <BrowserRouter>
        <NavB/>
          <Routes>
            <Route path='/' element={<SignIn/>}/>
            <Route path='/signin' element={<SignIn/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/requests' element={
              <>
                <RequestConsole />
                <ItemConsole />
              </>
            }/>
            <Route path='/items' element={<ItemConsole/>}/>
            <Route path='/users' element={<UserConsole/>}/>
            <Route path='/*' element={<NotFound/>}/>
          </Routes>
      </BrowserRouter>
    </ItemTypeProvider>
  );
}

export default App;