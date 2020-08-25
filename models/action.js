const mongoose = require('mongoose');
const ActionSchema = new mongoose.Schema({
    name: {
        required: false,
        type: String,
    },
    sensor: {
        required: true,
        type:String,
    },
    condition: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Action",ActionSchema);