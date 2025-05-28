import React from 'react';
import './App.css';
import NavB from './components/NavBar/NavB';
import { RequestConsole } from './components/Requests/RequestConsole';
import { UserConsole } from './components/Users/UserConsole';
import { ItemConsole } from './components/Items/ItemConsole';
import { BrowserRouter, Route, Routes } from 'react-router';
import NotFound from './components/Common/NotFound';
import { ItemTypeProvider } from './components/NavBar/ItemTypeContext'; // Import the provider

function App() {
  return (
    <ItemTypeProvider> {/* Wrap entire app inside the provider */}
      <BrowserRouter>
        <NavB/>
          <Routes>
            <Route path='/' element={
              <>
                <RequestConsole />
                <ItemConsole />
              </>}/>
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