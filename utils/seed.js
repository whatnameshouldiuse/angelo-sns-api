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

    for (let i=0; i<10; i++) {
        const username = usernamesShuffled[i];
        const email = emailsShuffled[i];

        users.push({
            username,
            email
        });
    }
    await User.collection.insertMany(students);

    const allPossibleReactions = [];
    usernames.forEach(username => {
        reactions.forEach(reactionBody => {
            allPossibleReactions.push({
                username,
                reactionBody
            });
        });
    });

    const thoughts = [];
    const thoughtsShuffled = shuffle(thoughts);

    for (let i=0; i<20; i++) {
        const thoughtText = thoughtsShuffled[i];
        const username = users[Math.floor(Math.random() * users.length)];

        const reactions = shuffle(
                allPossibleReactions
                .filter((reaction) => {return reaction.username != username}))
                .splice(0, Math.floor(Math.random() * 3));

        thoughts.push({
            thoughtText,
            username,
            reactions
        })
    }
    await Thought.collection.insertMany(thoughts);

    console.info('Seeding Complete!');
    process.exit(0);
})