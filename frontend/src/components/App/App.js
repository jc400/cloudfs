import React, { useState, useReducer, useEffect, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { template } from '../../config/config';
import { logout } from '../../services/api';
import loadVaultFlow from '../../services/loadVaultFlow';
import saveVaultFlow from '../../services/saveVaultFlow';

import Sidebar from '../Sidebar/Sidebar';
import FileExplorer from '../FileExplorer/FileExplorer';
import Workspace from '../Workspace/Workspace';
import Login from '../Login/Login';
import Register from '../Register/Register';

import './App.css';



export const DBContext = createContext();

function App() {
  // db + user state
  const [db, setDB] = useState(template);
  const [user, setUser] = useState({ username: null, encryptionKey: null });

  const changeDB = {
    // consolidates logic for making changes to data store. Wrapper 
    // around setDB() method
    add: kwargs => {
      let file = {
        "parent": kwargs.parent ?? null,
        "file_type": kwargs.file_type ?? "f",
        "title": kwargs.title ?? "Untitled",
        "content": kwargs.content ?? "",
        "created": new Date().toUTCString(),
        "updated": new Date().toUTCString(),
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
        if (kwargs.content) {
          newFiles[file_key].updated = new Date().toUTCString();
        }
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

  const VaultActions = {
    create: () => setDB(template),
    load: () => {
      loadVaultFlow(user.encryptionKey)
        .then(resp => {
          if (resp?.success) {
            setDB(resp?.db)
          } else {
            alert(resp?.message);
          }
        })
    },
    save: () => {
      return saveVaultFlow(db, user.encryptionKey);
    },
    logout: () => {
      // save current vault, then clear current data
      saveVaultFlow(db, user.encryptionKey);
      setDB(template);
      logout();
      setUser({ username: null, encryptionKey: null });
      setShowLogin(true);

      // reset UI
      UIState.setActiveMid(null);
      UIState.setActiveFile(null);
    }
  }

  // UI state
  const [activeMid, setActiveMid] = useReducer((st, n) => st === n ? null : n, null);
  const [activeFile, setActiveFile] = useState(null);
  const [searchString, setSearchString] = useState(null);
  const UIState = {
    activeMid: activeMid,
    setActiveMid: setActiveMid,
    activeFile: activeFile,
    setActiveFile: setActiveFile,
    searchString: searchString,
    setSearchString: setSearchString,
  }

  // login stuff
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const switchTo = () => {
    if (showLogin) {
      setShowLogin(false);
      setShowRegister(true);
    } else if (showRegister) {
      setShowRegister(false);
      setShowLogin(true);
    }
  }

  useEffect(() => {
    if (user.username){
      setShowLogin(false);
    }
  }, [user]);


  return (
    <DBContext.Provider value={{ db, changeDB }}>
      <div style={{ display: "flex", height: "100vh" }}>

        <Sidebar UIState={UIState} VaultActions={VaultActions} username={user?.username} />

        <FileExplorer UIState={UIState} />

        <Workspace UIState={UIState} />

        <Login
          show={showLogin}
          close={() => setShowLogin(false)}
          switchTo={switchTo}
          setUser={setUser}
          setDB={setDB}
        />
        <Register
          show={showRegister}
          close={() => setShowRegister(false)}
          switchTo={switchTo}
          setUser={setUser}
          setDB={setDB}
        />

      </div>
    </DBContext.Provider>
  );
}

export default App;
