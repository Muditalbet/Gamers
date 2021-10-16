import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Box, IconButton, Divider, Paper, Typography, Table, TableCell, TableBody, TableHead, TableContainer, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { LocalizationProvider, DateTimePicker } from '@mui/lab'
import { Edit, RemoveCircle } from '@mui/icons-material';
import axios from 'axios'


export default function Album({match}) {
    const [albumDetails, setAlbumDetails] = useState({})
    const [albumName, setAlbumName] = useState("")
    const [recordName, setRecordName] = useState("")
    const [value, setValue] = useState(new Date)
    const [songsList, setSongsList] = useState([])
    const [open, setOpen] = useState(false)
    const [openSongs, setOpenSongs] = useState(false)
    const [openArtists, setOpenArtists] = useState(false)
    const [newSongName, setNewSongName] = useState("")
    const [newSongDuration, setNewSongDuration] = useState("")
    const [newSongArtists, setNewSongArtists] = useState([])
    const [newSongArtist, setNewSongArtist] = useState("")
    const [songToBeAdd, setSongToBeAdd] = useState([])
    const [loadAgain, setLoadAgain] = useState(true)

    useEffect(()=>{
        async function fetchDetails(){
            let params = match.params.id
            let url = process.env.REACT_APP_URL + "v3/getAlbum"
            await Axios.get(url,{
                headers:{
                    authorization: params
                }
            }).then(response=>{
                setAlbumDetails(response.data)
                setSongsList(response.data.songs)
                setAlbumName(response.data.albumTitle)
                setRecordName(response.data.recordLable)
                setValue(response.data.albumReleasedOn)
            }).catch(err=>console.log(err))
        }
        fetchDetails()
    },[match.params.id, loadAgain])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickOpenSongs = () => {
        setOpenSongs(true);
    };
    const handleClickOpenArtists = () => {
        setOpenArtists(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        setSongToBeAdd([])
    };
    const handleCloseSongs = () => {
        setOpenSongs(false);
        setNewSongName("")
        setNewSongDuration("")
        setNewSongArtists([])
    };
    const handleCloseArtists = () => {
        setOpenArtists(false);
        setNewSongArtist("");
    };
    const removeSong = (song_id) =>{
        setSongsList(songsList.filter( (song_id1, index)=>index !== song_id))
    }
    const removeNewSong = (song_id) =>{
        setSongToBeAdd(songToBeAdd.filter( (song_id1, index)=>index !== song_id))
    }
    const removeArtists = (artist_id) =>{
        setNewSongArtists(newSongArtists.filter( (artist_id1, index)=>index !== artist_id))
    }
    const addArtistToSong = () =>{
        if(newSongArtist !== "") setNewSongArtists([...newSongArtists, {artistName: newSongArtist}])
        handleCloseArtists()
    }
    const addSongToAlbum = () =>{
        if( newSongName !== "" && newSongDuration !== "" ) setSongToBeAdd([...songToBeAdd, {songTitle:newSongName, songDuration:newSongDuration, songArtists:newSongArtists}])
        handleCloseSongs()
    }
    const postData = async() =>{
        let data
        let temp = []
        let url = process.env.REACT_APP_URL + "v3/editAlbum"
        songToBeAdd.map(element=>{
            temp.push(element)
        })
        songsList.forEach(song=>{
            temp.push({songTitle: song.songTitle, songDuration: song.songDuration, songArtists: song.songArtists.map(element=> element.artistName).map(element=> { return {artistName: element} })})
        })
        data = {
            albumTitle: albumName,
            recordLable: recordName,
            songs: temp,
            Authorization: albumDetails._id
        }
        console.log(data)
        await axios.post(url, data).then(response=>{
            if(response.data.Message) {
                setLoadAgain(!loadAgain)
                handleClose()
            }
        }).catch(err=>console.log(err))
    }

    return (
        <Box sx={{width:'100%'}}>
            <Box sx={{position:'relative', display:'block'}} >
                <div style={{ position:'relative', height:'40vh', width:'100%', display:'inline-block' }}>
                    <div style={{position: 'absolute', width:'100%', height:'40vh', background: 'linear-gradient(to bottom, rgba(225, 225, 225,0) 0%,rgba(225, 225, 225, 1.0) 100%)', boxShadow: '0 0 8px 0px white inset'}}></div>
                    <div style={{height:'40vh', display:'block', backgroundImage:"url(" + albumDetails.coverImage +")",backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundPosition:'center' }}></div>
                </div>
                <IconButton onClick={()=>handleClickOpen()} color="secondary" sx={{p:0, m:2, position:'absolute', top:'0', right:'0', zIndex:'2'}} component="div" >
                    <Edit color="primary" sx={{ fontSize: 30 }}/>
                </IconButton>
            </Box>
            <Box sx={{ml:5}}>
                <Typography variant="h2" sx={{textTransform:'capitalize'}}>{albumDetails.albumTitle}</Typography>
                <Typography variant="h7" sx={{textTransform:'capitalize', ml:2.5}}>{albumDetails.recordLable} | {new Date(albumDetails.albumReleasedOn).getFullYear()}</Typography>
            </Box>
            <Box sx={{ m:6 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {songsList.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.songTitle}
                                </TableCell>
                                <TableCell align="right">{row.songDuration}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
                <DialogTitle>Edit Album</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="albumName"
                            label="Album name"
                            type="text"
                            fullWidth
                            value={albumName}
                            onChange={(e)=>setAlbumName(e.target.value)}
                            required
                            variant="standard"
                        />
                        <Box sx={{display:'flex', justifyContent:'space-between', flexWrap:'wrap'}} >
                            <TextField
                                sx={{marginBottom:"10px"}}
                                autoComplete="off"
                                margin="dense"
                                id="recordLabel"
                                label="Record Label Name"
                                type="text"
                                value={recordName}
                                onChange={(e)=>setRecordName(e.target.value)}
                                required
                                variant="standard"
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField {...props} />}
                                    label="Release Date"
                                    value={value}
                                    onChange={(newValue) => {
                                    setValue(newValue);
                                    }}
                                    minDateTime={new Date()}
                                />
                            </LocalizationProvider>
                        </Box>
                        <DialogActions>
                            <Box>
                                <Button variant='outlined' onClick={handleClickOpenSongs} >Add Songs</Button>
                            </Box>
                        </DialogActions>
                        <Box>
                            {songsList.length? songsList.map((element, index)=>{
                                return(
                                    <Box key={index} sx={{display:'flex', justifyContent:'space-between'}}>
                                        <Box>{element.songTitle}</Box>
                                        <IconButton onClick={()=>removeSong(index)}>
                                            <RemoveCircle />
                                        </IconButton>
                                    </Box>
                                )
                            }):<div></div>}
                            {songToBeAdd.length > 0 ? <Box>
                                <Divider />
                                <Typography variant="h7" color="green" >New songs to add</Typography>
                            </Box>:<></>}
                            {songToBeAdd.map((element,index)=>{
                                return(
                                    <Box key={index} sx={{display:'flex', justifyContent:'space-between'}}>
                                        <Box>{element.songTitle}</Box>
                                        <IconButton onClick={()=>removeNewSong(index)}>
                                            <RemoveCircle />
                                        </IconButton>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box>
                        <Button sx={{m:1}} variant='contained' onClick={handleClose}>Cancel</Button>
                        <Button sx={{m:1}} variant='contained' onClick={postData}>Apply Changes</Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth={true} maxWidth="sm" open={openSongs} onClose={handleCloseSongs}>
                <DialogTitle>Add Song</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="songName"
                            label="Song name"
                            type="text"
                            fullWidth
                            value={newSongName}
                            onChange={(e)=>setNewSongName(e.target.value)}
                            required
                            variant="standard"
                        />
                        <TextField
                            autoComplete="off"
                            margin="dense"
                            id="songDuration"
                            label="Song Duration"
                            type="text"
                            fullWidth
                            value={newSongDuration}
                            onChange={(e)=>setNewSongDuration(e.target.value)}
                            required
                            variant="standard"
                        />
                        <DialogActions>
                            <Box>
                                <Button variant="outlined" color="success" onClick={handleClickOpenArtists}>Add Artists</Button>
                            </Box>
                        </DialogActions>
                        { newSongArtists.length? newSongArtists.map((element, index)=>{
                            return (
                                <Box key={index} sx={{display:'flex', justifyContent:'space-between'}}>
                                    <Box>{element.artistName}</Box>
                                    <IconButton onClick={()=>removeArtists(index)}>
                                        <RemoveCircle />
                                    </IconButton>
                                </Box>
                            )
                        }):<Box></Box>}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box>
                        <Button sx={{m:1}} variant='contained' onClick={handleCloseSongs}>Cancel</Button>
                        <Button sx={{m:1}} variant='contained' onClick={addSongToAlbum}>Add Songs</Button>
                    </Box>
                </DialogActions>
            </Dialog>
            
            <Dialog fullWidth={true} maxWidth="sm" open={openArtists} onClose={handleCloseArtists}>
                <DialogTitle>Add Artist</DialogTitle>
                <DialogContent>
                    <Stack spacing={1}>
                        <TextField
                            autoFocus
                            autoComplete="off"
                            margin="dense"
                            id="artistName"
                            label="Artist name"
                            type="text"
                            fullWidth
                            value={newSongArtist}
                            onChange={(e)=>setNewSongArtist(e.target.value)}
                            required
                            variant="standard"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box>
                        <Button sx={{m:1}} variant='contained' onClick={handleCloseArtists}>Cancel</Button>
                        <Button sx={{m:1}} variant='contained' onClick={()=>addArtistToSong()}>Add Artist</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
