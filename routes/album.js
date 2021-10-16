const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Album = mongoose.model('Album')

router.post('/addAlbum', async (req, res)=>{
    const { albumTitle, coverImage, recordLable, albumReleasedOn } = req.body
    if( !albumTitle || !coverImage || !recordLable ) return res.json({error:"Field missing"})
    let songs = []
    const newAlbum = new Album({
        albumTitle,
        coverImage,
        recordLable,
        albumReleasedOn,
        songs
    })
    newAlbum.save()
    .then(response=>{
        console.log(response)
        return res.json({message:"Album added sucessfully"})
    }).catch(err=>console.log(err))
})

router.post('/editAlbum', async (req, res)=>{
    const { albumTitle, recordLable, songs, Authorization } = req.body
    // const { Authorization } = req.header
    if( !Authorization ) return res.json({error:"Authorization missing"})
    if( !albumTitle, !recordLable, !songs ) return res.json({error:"Field is missing"})
    Album.findOneAndUpdate(
        {_id: Authorization},
        { albumTitle:albumTitle, recordLable:recordLable, songs:songs },
        null,
        (err, docs)=>{
            if(err) return res.send(err)
            console.log(docs)
            res.json({Message: 'Album updated'})
        }
    )
})

router.get('/getAlbums', async (req, res)=>{
    Album.find()
    .then(response=>{
        console.log(response)
        return res.send(response)
    }).catch(err=>console.log(err))
})

router.get('/getAlbum', async (req, res)=>{
    const { authorization } = req.headers
    if( !authorization ) return res.status(422).json({error:"Authorization missing."})
    Album.findById(authorization)
    .then(response=>{
        console.log(response)
        return res.send(response)
    }).catch(err=>console.log(err))
})

router.get('/getSongs', async (req, res)=>{
    Album.find()
    .then(response=>{
        let finalResponse = []
        response.forEach(albumElement=>{
            let albumTemp = {song_id: null, album_id: albumElement._id, cover: albumElement.coverImage, name: albumElement.albumTitle, duration: null, artist: [], isSong: false}
            finalResponse.push(albumTemp)
            albumElement.songs.forEach(songElement=>{
                let temp = {song_id: songElement._id, album_id: albumElement._id, cover: albumElement.coverImage, name: songElement.songTitle, duration: songElement.songDuration, artist: songElement.songArtists, isSong: true}
                finalResponse.push(temp)
            })
        })
        console.log("check: " ,finalResponse)
        res.send(finalResponse)
    }).catch(err=>console.log(err))
})

module.exports = router