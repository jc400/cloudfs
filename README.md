# CloudFS

## Introduction

CloudFS is yet another note-taking app. The architecture is based on password managers like BitWarden--the server stores an encrypted vault (holding the user's folders and notes) and the client retrieves this encrypted blob via an API call and decrypts everything client-side. To save the vault, the client re-encrypts everything and posts the resulting data back to the server. 


## Setup

You can run `docker compose build` to get CloudFS running inside Docker. 

Alternatively, you can run the frontend and backend development servers manually. Add the line `"proxy":"http://localhost:5000/"` to package.json to proxy requests from the client to the API server, then use `npm start` to run the frontend and `flask run` to run the backend.