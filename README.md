# Links
Frontend repository: [decadent-governmental-infrastructure-report-client](https://github.com/VINIRR99/decadent-governmental-infrastructure-report-client) \
Frontend deploy: [https://infraestructure-report-client.herokuapp.com](https://infraestructure-report-client.herokuapp.com) \
Backend deploy: [https://infraestructure-report-api.herokuapp.com](https://infraestructure-report-api.herokuapp.com) \

## Public endpoints:

| METHOD | ENDPOINT      | PAYLOAD                                                                                                                                                                                                                      | RESPONSE        | ACTION                                                                                         |
| ------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| GET    | /reports      | \-                                                                                                                                                                                                                           | \[{ Report }\]  | Get all reports<br>from DB                                                                     |
| GET    | /user/:userId | \-                                                                                                                                                                                                                           | { User }        | Get one user<br>by id                                                                          |
| POST   | /auth/signup  | {<br>username: { type: String, required: true },<br>password: { type: String, required: true },<br>passwordConfirmation: { type: String, required: true },<br>name: { type: String },<br>profileImage: { type: String }<br>} | { user, token } | Creates an<br>user in DB and<br>creates a token<br>for the user to<br>access private<br>routes |
| POST   | /auth/login   | {<br>username: { type: String, required: true },<br>password: { type: String, required: true }<br>}                                                                                                                          | { user, token } | Creates a<br>token for the<br>user to acces<br>private routes                                  |                               |

## Private endpoints:

| METHOD | ENDPOINT            | PAYLOAD                                                                                                                                                          | RESPONSE        | ACTION                                                                      |
| ------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------- |
| POST   | /reports            | {<br>description: { type: String },<br>image: { type: String, required: true },<br>location: { type: String, required: true }<br>}                               | { Report }      | Creates a new<br>report linked to<br>the user                               |
| PUT    | /reports/:reportId  | {<br>description: { type: String },<br>image: { type: String },<br>location: { type: String },<br>fixed: { type: Boolean }<br>}                                  | { Report }      | Updates the<br>description,<br>image, location<br>or fixed of the<br>report |
| DELETE | /reports/:reportId  | \-                                                                                                                                                               | \-              | Deletes a report<br>and all<br>comments<br>linked to it                     |
| POST   | /comment            | {<br>comment: { type: String, required: true }<br>}                                                                                                              | { Comment }     | Posts a new<br>comment about<br>a report                                    |
| PUT    | /comment/:commentId | {<br>comment: { type: String, required: true }<br>}                                                                                                              | { Comment }     | Updates a<br>comment                                                        |
| DELETE | /comment/:commentId | \-                                                                                                                                                               | \-              | Deletes a<br>comment                                                        |
| PUT\*  | /user/:userId       | {<br>newUsername: { type: String, required: true },<br>password: { type: String, required: true }<br>}                                                           | { user, token } | Updates the<br>username of the<br>user using the<br>password to<br>check    |
| PUT    | /user/:userId       | {<br>password: { type: String, required: true },<br>newPassword: { type: String, required: true }<br>passwordConfirmation: { type: String, required: true }<br>} | { user, token } | Updates the<br>password of the<br>user                                      |
| PUT    | /user/:userId       | {<br>name: { type: String },<br>profileImage: { type: String },<br>readLater: { type: String }<br>}                                                              | { user, token } | Updated the<br>name,<br>profileImage or<br>the readLater of<br>the user     |
| DELETE | /user/:userId       | \-                                                                                                                                                               | \-              | Deletes a user<br>and all reports<br>and comments<br>linked to it           |

Obs: on updating readLater is accepted two strings as values.
```
// reportIdtoAdd is the id of the report to be added to the readLater array of the user
{ "readLater": "add " +reportIdtoAdd }

// reportIdtoRemove is the id of the report to be removed of the readLater array of the user
{ "readLater": "remove " +reportIdtoRemove }
```
