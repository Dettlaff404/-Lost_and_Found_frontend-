import React from 'react';
import './App.css';
import NavB from './components/NavBar/NavB';
import { RequestConsole } from './components/Requests/RequestConsole';
import { UserConsole } from './components/Users/UserConsole';
import { ItemConsole } from './components/Items/ItemConsole';

function App() {
  return (
    <>
      <NavB/>
      <RequestConsole/>
      <UserConsole/>
      <ItemConsole/>
    </>
  );
}

export default App;
