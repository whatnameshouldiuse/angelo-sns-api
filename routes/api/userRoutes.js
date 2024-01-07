const router = require('express').Router();
const {
    getUsers,
    createUser,
    getSingleUser,
    updateSingleUser,
    deleteSingleUser,
    addFriendToUser,
    deleteFriendFromUser
} = require('../../controllers/userController');

// api/users GET, POST
router.route('/')
    .get(getUsers)
    .post(createUser);

// api/users/:userId GET, PUT, DELETE
router.route('/:userId')
    .get(getSingleUser)
    .put(updateSingleUser)
    .delete(deleteSingleUser);

// api/users/:userId/friends/:friendId POST, DELETE
router.route('/:userId/friends/:friendId')
    .post(addFriendToUser)
    .delete(deleteFriendFromUser);

module.exports = router;