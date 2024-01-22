const { User, Thought } = require('../models');

const getUsers = async function(req, res) {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

const createUser = async function(req, res) {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getSingleUser = async function(req, res) {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .populate('friends')
            .populate('thoughts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateSingleUser = async function(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteSingleUser = async function(req, res) {
    try {
        const user = await User.findOneAndDelete(
            { _id: req.params.userId },
            { $set: req.body }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await Thought.deleteMany(
            { username: user.username }
        );
        res.json({ message: 'User successfully deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
}

const addFriendToUser = async function(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true}
        )
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteFriendFromUser = async function(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { $in: [ req.params.friendId ] } } },
            { runValidators: true, new: true}
        )
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getUsers,
    createUser,
    getSingleUser,
    updateSingleUser,
    deleteSingleUser,
    addFriendToUser,
    deleteFriendFromUser
}