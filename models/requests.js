const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    reportItems: [
        {
            name: {
                type: String,
                required: true,
            },
            sensor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sensor",
                required: true,
            },
            daysSpan: Number,
            type: {
                required: true,
                type: String,
            }
        }
    ],
    time: {
        type: Date,
        required: true,
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

});

module.exports =mongoose.model("Request",RequestSchema);