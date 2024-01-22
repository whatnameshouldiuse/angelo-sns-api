const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        username: {type: String, required: true, unique: true, trim: true},
        email: { type: String, required: true, unique: true, match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]},
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],
         friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJson: { virtuals: true }
    }
)
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const User = model('user', userSchema);

module.exports = User;