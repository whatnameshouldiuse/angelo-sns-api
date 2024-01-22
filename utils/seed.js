const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { usernames, emails, thoughts, reactions } = require('./data');
const { shuffle } = require('./shuffle');

connection.on('error', (err) => err);

connection.once('open', async() => {
    console.log('connected');

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
        await connection.dropCollection('users');
    }
    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
        await connection.dropCollection('thoughts');
    }

    const users = [];

    const usernamesShuffled = shuffle(usernames);
    const emailsShuffled = shuffle(emails);

    // Creating Users
    for (let i=0; i<10; i++) {
        const username = usernamesShuffled[i];
        const email = emailsShuffled[i];

        users.push({
            username,
            email,
            friends: [],
            thoughts: []
        });
    }
    
    // Preparing Reactions
    const allPossibleReactions = [];
    usernames.forEach(username => {
        reactions.forEach(reactionBody => {
            allPossibleReactions.push({
                username,
                reactionBody
            });
        });
    });

    const tghts = [];
    const thoughtsShuffled = shuffle(thoughts);

    // Creating Thoughts
    for (let i=0; i<20; i++) {
        const thoughtText = thoughtsShuffled[i];
        const username = users[Math.floor(Math.random() * users.length)].username;

        const reactions = shuffle(
            allPossibleReactions
                .filter((reaction) => {return reaction.username != username})
            )
            .splice(0, Math.floor(Math.random() * 5));

        tghts.push({
            thoughtText,
            username,
            reactions
        })
    }

    await User.collection.insertMany(users);
    await Thought.collection.insertMany(tghts);

    //Inserting Friends, but through the User model
    const syncUser = await User.find();
    await Promise.all(syncUser.map(async (user) => {
        var potentialFriends = shuffle(syncUser.filter((possibleFriend) => {
            return possibleFriend.username != user.username;
        }))
        .splice(0, Math.floor(Math.random() * 5))
        .map((friend) => friend._id);

        await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { friends: { $each: potentialFriends } } },
            { runValidators: true }
        );
    }));

    //Inserting Thoughts, but through the User model
    const syncThought = await Thought.find();
    await Promise.all(syncThought.map(async (thought) => {
        var thoughtOwner = syncUser.find((user) => {
            return user.username == thought.username;
        });

        await User.findOneAndUpdate(
            { _id: thoughtOwner._id },
            { $addToSet: { thoughts: thought._id } },
            { runValidators: true, new: true }
        );
    }));

    console.info('Seeding Complete!');
    process.exit(0);
})