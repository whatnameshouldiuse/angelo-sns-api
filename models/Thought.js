const { Schema, model } = require('mongoose');

const reactionSchema = Schema(
    {
        reactionId: { type: mongoose.Schema.Types.ObjectId, auto: true },
        reactionBody: { type: String, required: true, maxLength: 280 },
        username: { type: String, requried: true },
        createdAt: { type: Date, default: Date.now, get: (date) => { return date.toString() } }
    },
    {
        toJson: { getters: true },
        id: false
    }
)

const thoughtSchema = Schema(
    {
        thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
        createdAt: { type: Date, default: Date.now, get: (date) => { return date.toString() } },
        username: { type: String, required: true },
        reations:  [reactionSchema]
    },
    {
        toJson: { virtuals: true, getters: true }
    }
)
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

// Model Initialization
const Thought = model('thought', thoughtSchema);

module.exports = Thought;