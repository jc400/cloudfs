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


  const changeDB = { 
    // consolidates logic for making changes to data store. Wrapper 
    // around setDB() method
    add: kwargs => {
      let file = {
        "parent":     kwargs.parent ?? 0,
        "file_type":  kwargs.parent ?? "f",
        "title":      kwargs.parent ?? "Untitled document",
        "content":    kwargs.parent ?? "",
        "created":    Date(),
        "updated":    Date(),
        "size":       null,
        "starred":    kwargs.parent ?? false,
        "tags":       kwargs.parent ?? []
      };
      setDB(prev => {
        let newFiles = structureCopy(prev.files);
        newFiles.push(file);
        return {...prev, "files": newFiles}
      })
    },
    edit: kwargs => {
      console.log(kwargs);
    },
    remove: file_idx => {
      setDB(prev => {
        let newFiles = structureCopy(prev.files);
        newFiles.pop(file_idx);
        return {...prev, "files": newFiles}
      })
    }
  }


  return (
    <>
      <DBContext.Provider value={{ db, changeDB }}>
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
