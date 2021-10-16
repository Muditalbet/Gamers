const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    albumTitle:{
        type:String,
        required:"Title is require",
        trim:true
    },
    coverImage:{
        type:String,
        require:"Cover Image is require",
        trim:true
    },
    recordLable:{
        type:String,
        required:"User name is require",
        trim:true
    },
    albumReleasedOn:{
        type:Date,
        default: () => Date.now()
    },
    songs:[{
        songTitle:{type:String, required:true},
        songDuration:{type:String, required:true},
        songArtists:[{
            artistName:{type:String, required:true}
        }]
    }]
});

module.exports = mongoose.model("Album", albumSchema);