![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Infrastructure Report - API

My third and final project of the Ironhack Web Development bootcamp was an full-stack application app to denouce decadent government infrastructures linke schools, roads, etc.
In this repository is stored the backend of the project.

## Links

Backend deploy: [https://infraestructure-report-api.herokuapp.com](https://infraestructure-report-api.herokuapp.com) \
Frontend repository: [decadent-governmental-infrastructure-report-client](https://github.com/VINIRR99/decadent-governmental-infrastructure-report-client) \
Frontend deploy: [https://infraestructure-report-client.herokuapp.com](https://infraestructure-report-client.herokuapp.com) \

## Technologies

- JavaScript
- Node.js
- Express.js
- MongoDB

## Usage

### Set your enviroment variables with
```javascript
MONGODB_URI=                   // your local mongoDB or AtlasDB
PORT=5000                      // use the one you prefer
SECRET_JWT=                    // your favorite way to encode the secret
ACCESS_CONTROL_ALLOW_ORIGIN=   // the frontend URI
CLOUDINARY_NAME=               // your cloud name
CLOUDINARY_API_KEY=            // your cloud key
CLOUDINARY_API_SECRET=         // your cloud secret
```

### In the project directory, you can run:

#### `npm start` (node) or `npm run dev` (nodemon)

To start your application at
```
http://localhost:<PORT>
```

## Public Endpoints

| METHOD | ENDPOINT           | PAYLOAD                                                                                                                                                                                                                      | RESPONSE        | ACTION                                                                                         |
| ------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| GET    | /reports           | \-                                                                                                                                                                                                                           | \[{ Report }\]  | Get all reports<br>from DB                                                                     |
| GET    | /reports/:reportId | \-                                                                                                                                                                                                                           | { Report }      | Get one report                                                                                 |
| GET    | /user/:userId      | \-                                                                                                                                                                                                                           | { User }        | Get one user<br>by id                                                                          |
| POST   | /auth/signup       | {<br>username: { type: String, required: true },<br>password: { type: String, required: true },<br>passwordConfirmation: { type: String, required: true },<br>name: { type: String },<br>profileImage: { type: String }<br>} | { user, token } | Creates an<br>user in DB and<br>creates a token<br>for the user to<br>access private<br>routes |
| POST   | /auth/login        | {<br>username: { type: String, required: true },<br>password: { type: String, required: true }<br>}                                                                                                                          | { user, token } | Creates a<br>token for the<br>user to acces<br>private routes                                  |

## Private Endpoints

| METHOD | ENDPOINT            | PAYLOAD                                                                                                                                                          | RESPONSE    | ACTION                                                                      |
| ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| POST   | /reports            | {<br>description: { type: String },<br>image: { type: String, required: true },<br>location: { type: String, required: true }<br>}                               | { Report }  | Creates a new<br>report linked to<br>the user                               |
| PUT    | /reports/:reportId  | {<br>image: { File }<br>}                                                                                                                                        | { Report }  | Upload the<br>image of the<br>report                                        |
| PUT    | /reports/:reportId  | {<br>description: { type: String },<br>image: { type: String },<br>location: { type: String },<br>fixed: { type: Boolean }<br>}                                  | { Report }  | Updates the<br>description,<br>image, location<br>or fixed of the<br>report |
| DELETE | /reports/:reportId  | \-                                                                                                                                                               | \-          | Deletes a report<br>and all<br>comments<br>linked to it                     |
| POST   | /comment/:reportId  | {<br>comment: { type: String, required: true }<br>}                                                                                                              | { Comment } | Posts a new<br>comment about<br>a report                                    |
| PUT    | /comment/:commentId | {<br>comment: { type: String, required: true }<br>}                                                                                                              | { Comment } | Updates a<br>comment                                                        |
| DELETE | /comment/:commentId | \-                                                                                                                                                               | \-          | Deletes a<br>comment                                                        |
| PUT    | /use/upload-image   | {<br>image: { File }<br>}                                                                                                                                        | { use }     |                                                                             |
| PUT\*  | /user               | {<br>newUsername: { type: String, required: true },<br>password: { type: String, required: true }<br>}                                                           | { user }    | Updates the<br>username of the<br>user using the<br>password to<br>check    |
| PUT    | /user               | {<br>password: { type: String, required: true },<br>newPassword: { type: String, required: true }<br>passwordConfirmation: { type: String, required: true }<br>} | { user }    | Updates the<br>password of the<br>user                                      |
| PUT    | /user               | {<br>name: { type: String },<br>profileImage: { type: String },<br>readLater: { type: String }<br>}                                                              | { user }    | Updated the<br>name,<br>profileImage or<br>the readLater of<br>the user     |
| DELETE | /user               | \-                                                                                                                                                               | \-          | Deletes a user<br>and all reports<br>and comments<br>linked to it           |
