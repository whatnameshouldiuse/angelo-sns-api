const router = require('express').Router();
const {
    getThoughts,
    createThought,
    getSingleThought,
    updateSingleThought,
    deleteSingleThought,
    addReactionToThought,
    deleteReactionFromThought
} = require('../../controllers/thoughtController');

// api/thoughts GET, POST
router.route('/')
    .get(getThoughts)
    .post(createThought);

// api/thoughts/:thoughtId GET, PUT, DELETE
router.route('/:thoughtId')
    .get(getSingleThought)
    .put(updateSingleThought)
    .delete(deleteSingleThought);

// api/thoughts/:thoughtId/reactions POST
router.route('/:thoughtId/reactions')
    .post(addReactionToThought);

// api/thoughts/:thoughtid/reactions/:reactionId DELETE
router.route('/:thoughtId/reactions/:reactionid')
    .delete(deleteReactionFromThought);

module.exports = router;