const mongoose = require('mongoose')
const url = "mongodb+srv://munawaralimangat:munawaralimangat123@cluster1.ilwhfop.mongodb.net/BicycleRepublic?retryWrites=true&w=majority"

// const url = "mongodb://127.0.0.1:27017/projectBicycle"
async function connectDB() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("database connected to atlas")
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

module.exports = connectDB;