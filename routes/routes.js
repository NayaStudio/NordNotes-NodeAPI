const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
// const { SignUp, Login, ViewUsers } = require("../controllers/UsersController");
const { login, signUp } = require("../controllers/usersController")
const router = require("express-promise-router")()
const UserModel = require('../models/user')
const { response } = require("express")

router.route("/").get((req, res) => {
  return res
    .json({
      message: "Welcome to the NordNotes API",
    })
})

router.route('/login').post(login)


//  Sample route with JWT authentication, in final project this shoud be implement in controller (as above routes)
router.route('/posts').post(verifyToken, (req, res) => {  
  jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Protected API/POST - post created...',
        authData
      })
    }
  })
})

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"]
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space -> exclude "Bearer " from token string
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    req.token = bearerToken
    // Next middleware
    next()
  } else {
    // Send forbidden code
    res.sendStatus(403)
  }
}

module.exports = router
