const mongoose = require('mongoose');
const Schema = mongoose.Schema

const favoriteSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        campsite: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        }]
    }, 
    { timestamps: true }
)
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;