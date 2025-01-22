const mongoose = require("mongoose")

// Load enviorment variables
require("dotenv").config()

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb Connected Successfully")
    } catch (error) {
        console.log("Error to Connect Mongodb", error)
    }
}

module.exports = connectdb