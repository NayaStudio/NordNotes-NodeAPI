const express = require('express');
const router = require('express-promise-router')();
const notesController = require('../controllers/notesController');
const { validate_param, validate_body, schemas}  = require('../helpers/route-helper');

router.route('/')
    .get(notesController.index)
    .post(validate_body(schemas.noteSchema), notesController.addNote);

router.route('/:note_id')
    .get(validate_param(schemas.idSchema, 'note_id'), notesController.getNote)
    .put(validate_param(schemas.idSchema, 'note_id'), validate_body(schemas.putCarSchema), notesController.replaceNote)
    .patch(validate_param(schemas.idSchema, 'note_id'), validate_body(schemas.patchNoteSchema), notesController.updateNote)
    .delete(validate_param(schemas.idSchema, 'note_id'), notesController.deleteNote);

router.route('/shared/:note_id/:note_key')
    .get(notesController.getSharedNote)

module.exports = router;