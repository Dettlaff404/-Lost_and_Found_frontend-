import React from 'react';
import './App.css';
import NavB from './components/NavBar/NavB';
import { RequestConsole } from './components/Requests/RequestConsole';

function App() {
  return (
    <>
      <NavB/>
      <RequestConsole/>
    </>
  );
}

export default App;
