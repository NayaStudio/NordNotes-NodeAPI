const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validate_param, validate_body, schemas}  = require('../helpers/route-helper');

router.get('/', usersController.index);

router.post('/', validate_body(schemas.userSchema), usersController.addUser);

router.route('/:user_id')
    .get(validate_param(schemas.idSchema, 'user_id'), usersController.getUser)
    .put([validate_param(schemas.idSchema, 'user_id'), validate_body(schemas.userSchema)], usersController.replaceUser)
    .patch([validate_param(schemas.idSchema, 'user_id'), validate_body(schemas.userPatchSchema)], usersController.updateUser);

router.get('/:userId/notes', validate_param(schemas.idSchema, 'userId'), usersController.getUserNotes);
router.post('/:user_id/notes', 
            [validate_param(schemas.idSchema, 'user_id'), 
            validate_body(schemas.userNoteSchema)], 
            usersController.addUserNote);

module.exports = router;