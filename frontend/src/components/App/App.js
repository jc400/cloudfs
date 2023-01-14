import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { template } from '../../config/config';
import { getBlob, putBlob } from '../../services/api';

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
        "parent":     kwargs.parent ?? "home",
        "file_type":  kwargs.file_type ?? "f",
        "title":      kwargs.title ?? "Untitled",
        "content":    kwargs.content ?? "",
        "created":    new Date().toUTCString(),
        "updated":    new Date().toUTCString(),
        "starred":    kwargs.starred ?? false,
        "tags":       kwargs.tags ?? []
      };
      let file_key = uuidv4();
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        newFiles[file_key] = file;
        return {...prev, "files": newFiles}
      });
      return file_key;
    },
    edit: (file_key, kwargs) => {
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        newFiles[file_key] = {...newFiles[file_key], ...kwargs};
        return {...prev, "files": newFiles};
      })
    },
    remove: file_key => {
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        delete(newFiles[file_key]);
        return {...prev, "files": newFiles}
      })
    }
  }
  const createDB = () => setDB(template);
  const loadDB = () => getBlob().then(n => setDB(n));
  const saveDB = () => putBlob(db);

  const userCallbacks = {
    createDB: createDB,
    loadDB: loadDB,
    saveDB: saveDB
  }


  return (
    <>
      <DBContext.Provider value={{ db, changeDB }}>
        <BrowserRouter>
          <User
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            callbacks={userCallbacks}
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
              path="/text-editor/:file_key"
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
