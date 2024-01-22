const { User, Thought } = require('../models');

const getThoughts = async function(req, res) {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
}

const createThought = async function(req, res) {
    try {
        const thought = await Thought.create(req.body);
        await User.findOneAndUpdate(
            { username: thought.username },
            { $addToSet: { thoughts:  req.params.thoughtId } }
        );
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSingleThought = async function(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v');
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateSingleThought = async function(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteSingleThought = async function(req, res) {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        await User.findOneAndUpdate(
            { thoughts: { $in : [ req.params.thoughtId ] } },
            { $pull: { thoughts: { $in: [ req.params.thoughtId ] } } }
        );
        res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
}

const addReactionToThought = async function(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteReactionFromThought = async function(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getThoughts,
    createThought,
    getSingleThought,
    updateSingleThought,
    deleteSingleThought,
    addReactionToThought,
    deleteReactionFromThought
}