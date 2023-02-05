const mongoose = require('mongoose');
const { Schema } = mongoose;
const itemSchema = new Schema({
    // _id: new mongoose.Types.ObjectId(),


    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "item",

    },

    picURL: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});
const Item = mongoose.model("item", itemSchema);
module.exports = Item;


