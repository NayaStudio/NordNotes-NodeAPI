const mongoose = require("mongoose")
const { signToken } = require("../helpers/auth")
const UserModel = require("../models/user")
const NoteModel = require("../models/note")
const bcrypt = require("bcrypt")

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await UserModel.find({})
      return res
        .status(200)
        .json({ users })
    } catch (err) {
      next(err);
    }
  },
  signUp: (req, res) => {
    //Check whether that user already exists before creating a new document entry in our users collection.
    User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        //respond with user already exists
        return res
          .status(409) // CONFLICT
          .json({ message: "Username already taken!" });
      } else {
        //create the user
        const newUser = new User({
          username: req.body.username,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName
        });
        newUser.save()
          .then(saved => {
            console.log("New user signed: ", saved);
            const token = signToken(saved);
            return res
              .status(200)
              .json({ message: "Sign Up Successfull!", token: token });
          })
          .catch(error => {
            //Show error on console
            console.log("ERROR OCCURED: ", error);
            return res
              .status(417) // EXPECTATION_FAILED
              .json({ message: "Sing Up Failed!" });
          });
      }
    });
  },
  login: (req, res) => {
    UserModel.findOne({ username: req.body.username })
      .then(user => {
        if (user) {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res
                .status(404)
                .json({
                  error: "Unknown occured while loging you in, please retry!"
                })
            } else {
              if (result === true) {
                const token = signToken(user);
                return res
                  .status(200)
                  .json({
                    message: "You've successfully loged in!",
                    token: token
                  })
              } else {
                return res
                  .status(404)
                  .json({ error: "Invalid Password!" })
              }
            }
          })
        } else {
          return res
            .status(500)
            .json({ error: "No such user exists!" })
        }
      })
      .catch(error => {
        return res
          .status(500)
          .json({ error: "Fatal error occured!" })
      })
  },

  addUser: async (req, res, next) => {
    try {
      const new_user = new UserModel(req.value.body)
      // Hash user password before storing in DB
      const hashedPassword = await bcrypt.hash(req.value.body.password, 10)
      new_user.password = hashedPassword
      const user = await new_user.save()
      return res
        .status(201)  // CREATED
        .json({ user })
    } catch (err) {
      next(err)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const { user_id } = req.value.params
      const user = await UserModel.findById(user_id).populate("notes")
      return res
        .status(200)
        .json({ user })
    } catch (err) {
      next(err)
    }
  },

  replaceUser: async (req, res, next) => {
    try {
      const { user_id } = req.value.params
      const new_user = req.value.body
      const result = await UserModel.findByIdAndUpdate(user_id, new_user)
      return res
        .status(200)
        .json({ success: true })
    } catch (err) {
      next(err)
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { user_id } = req.value.params
      const new_user = req.value.body
      const result = await UserModel.findByIdAndUpdate(user_id, new_user)
      return res
        .status(200)
        .json(result)
    } catch (err) {
      next(err)
    }
  },

  getUserNotes: async (req, res, next) => {
    try {
      const { user_id } = req.value.params
      const user = await UserModel.findById(user_id).populate("notes")
      return res
        .status(200)
        .json({ notes: user.notes })
    } catch (err) {
      next(err)
    }
  },

  addUserNote: async (req, res, next) => {
    try {
      const { user_id } = req.value.params
      const new_note = new NoteModel(req.value.body)
      const user = await UserModel.findById(user_id)

      // Assign new note to user
      new_note.owner = user
      await new_note.save()

      // Add note to the user's array of notes
      user.notes.push(new_note)

      // Save the user with new note in array
      await user.save()

      return res
        .status(200)
        .json({ new_note })
    } catch (err) {
      next(err)
    }
  },
}
