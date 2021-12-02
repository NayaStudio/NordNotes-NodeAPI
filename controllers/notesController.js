const mongoose = require('mongoose');
const UserModel = require('../models/user');
const NoteModel = require('../models/note');

module.exports = {
    index: async (req, res, next) => {
        const notes = await NoteModel.find({});            
        res.status(200).json({notes});            
    },
    addNote: async (req, res, next) => {
        // get user (owner) model to assign new note to it
        const owner = await UserModel.findById(req.value.body.owner);

        // create new Note model
        const newNote = req.value.body;
        delete newNote.owner;
        const note = new NoteModel(newNote);
        await note.save();

        // assign note to user model (reference via "notes" array of ObjectID)
        owner.notes.push(note);
        
        await owner.save();
        
        res.status(200).json({note});
    },
    getNote: async (req, res, next) => {    
        const { note_id } = req.value.params
        const note = await NoteModel.findById(note_id)
        res.status(200).json({note});
    },
    getSharedNote: async (req, res, next) => {    
        const note_id = req.params.note_id
        const note_secretkey = req.params.note_key
        const note = await NoteModel.findById(note_id)
        if (note) {
            if (note.secretkey == note_secretkey) {
                res.status(200).json({note});
            }
        }
        return res
        .status(403)
    },
    replaceNote: async (req, res, next) => {
        const { note_id } = req.value.params;
        const newNote = req.value.body;
        const result = await NoteModel.findByIdAndUpdate(note_id, newNote);
        res.status(200).json({success: true});
    },
    updateNote: async (req, res, next) => {
        const { note_id } = req.value.params;
        const newNote = req.value.body;
        const result = await NoteModel.findByIdAndUpdate(note_id, newNote);
        res.status(200).json(result);
    }, 
    deleteNote: async (req, res, next) => {
        const { note_id } = req.value.params;
        // find note
        const note = await NoteModel.findById(note_id);
        if (!note) {
            res.status(404).json({error: 'Note not found'});
        }
        const ownerId = note.owner;

        // get owner of note
        const owner = await UserModel.findById(ownerId);

        // remove the note
        await note.remove();

        //remove note from the user note listing
        owner.notes.pull(note);

        await owner.save();

        res.status(200).json({success:true});
    },
    
};