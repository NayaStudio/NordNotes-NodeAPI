const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    // fields for login purposes
    username: String,
    password: String,
    // collection of references to notes
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'note'
    }]
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel