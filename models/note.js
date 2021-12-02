const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    // title showed always
    title: String,
    // body showed (passed thrue API) only when share_secretkey is provided and verified
    body: String,
    // define if note is shared to others
    shared: Boolean,
    // share secret key - not encrypted, but we can use BCrypt to hash this field
    share_secretkey: String,
    // relation to owner of this note - user via _id Object
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});

const NoteModel = mongoose.model('note', NoteSchema);

module.exports = NoteModel;