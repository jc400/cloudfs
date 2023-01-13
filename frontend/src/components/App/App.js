import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { template } from '../../config/config';

import FileExplorer from '../FileExplorer/FileExplorer';
import Login from '../Login/Login';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import Redirect from '../Redirect/Redirect';
import Register from '../Register/Register';
import TextEditor from '../TextEditor/TextEditor';
import User from '../User/User';

import './App.css';


export const DBContext = createContext();

function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [db, setDB] = useState(template);

  return (
    <>
      <DBContext.Provider value={{ db, setDB }}>
        <BrowserRouter>
          <User
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />
          <Routes>
            <Route path="/" element={<Redirect url="/file-explorer" />} />
            <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/file-explorer"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <FileExplorer />
                </PrivateRoute>
              }
            />
            <Route
              path="/text-editor/:file_id"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <TextEditor />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </DBContext.Provider>
    </>
  );
}

export default App;
