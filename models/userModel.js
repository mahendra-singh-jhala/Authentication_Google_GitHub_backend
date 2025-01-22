const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    googleId: {
        type: String
    },

    githubId: {
        type: String
    },

    displayName: {
        type: String
    },

    email:  {
        type: String
    },

    image: {
        type: String
    }
}, {timestamps: true})

const User = new mongoose.model("Users", userSchema)

module.exports = User