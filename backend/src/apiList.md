# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/reviews/accepted/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections

- GET /user/feed - gets you the profiles of other users on platform

status: ignored, interested, accepted, rejected