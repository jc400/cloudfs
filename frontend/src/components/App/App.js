import React, { useState, useReducer, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { template } from '../../config/config';
import { getBlob, putBlob } from '../../services/api';

import Sidebar from '../Sidebar/Sidebar';
import FileExplorer from '../FileExplorer/FileExplorer';
import Workspace from '../Workspace/Workspace';

import './App.css';



export const DBContext = createContext();

function App() {
  // db state
  const [db, setDB] = useState(template);
  const changeDB = {
    // consolidates logic for making changes to data store. Wrapper 
    // around setDB() method
    add: kwargs => {
      let file = {
        "parent": kwargs.parent ?? "home",
        "file_type": kwargs.file_type ?? "f",
        "title": kwargs.title ?? "Untitled",
        "content": kwargs.content ?? "",
        "created": new Date().toUTCString(),
        "updated": new Date().toUTCString(),
        "starred": kwargs.starred ?? false,
        "tags": kwargs.tags ?? []
      };
      let file_key = uuidv4();
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        newFiles[file_key] = file;
        return { ...prev, "files": newFiles }
      });
      return file_key;
    },
    edit: (file_key, kwargs) => {
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        newFiles[file_key] = { ...newFiles[file_key], ...kwargs };
        return { ...prev, "files": newFiles };
      })
    },
    remove: file_key => {
      setDB(prev => {
        let newFiles = structuredClone(prev.files);
        delete (newFiles[file_key]);
        return { ...prev, "files": newFiles }
      })
    }
  }
  const createDB = () => setDB(template);
  const loadDB = () => getBlob().then(n => setDB(n));
  const saveDB = () => putBlob(db);

  // UI state
  const [activeMid, setActiveMid] = useReducer((st, n) => st === n ? null : n, null);
  const [activeFile, setActiveFile] = useState(null);



  return (
    <DBContext.Provider value={{ db, changeDB }}>
      <div style={{ display: "flex" }}>

        <Sidebar activeMid={activeMid} setActiveMid={setActiveMid} />

        <FileExplorer activeMid={activeMid} />

        <Workspace activeFile={activeFile} />

      </div>
    </DBContext.Provider>
  );
}

export default App;
