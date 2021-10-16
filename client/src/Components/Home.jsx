import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { Box, Container, IconButton, Button, Grid, Card, CardMedia, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, CircularProgress } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { LocalizationProvider, DateTimePicker } from '@mui/lab'
import { AddCircle } from '@mui/icons-material'

export default function Home() {
    const [completeList, setCompleteList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openLoad, setOpenLoad] = useState(false);
    const [addingInfo, setAddingInfo] = useState(false);
    const [value, setValue] = useState(new Date());
    const [image, setImage] = useState("");
    const [albumName, setAlbumName] = useState("");
    const [recordName, setRecordName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loadAgain, setLoadAgain] = useState(true)

    useEffect(()=>{
        async function fetchList(){
            let url = process.env.REACT_APP_URL + "v3/getSongs"
            await Axios.get(url).then(response=>{
                if(response.data) setCompleteList(response.data)
            }).catch(err=>console.log(err))
        }
        fetchList()
    },[loadAgain])
    useEffect(()=>{
        async function addAlbum(){
            let url = process.env.REACT_APP_URL + "v3/addAlbum"
            await Axios.post(url, {
                albumTitle: albumName,
                coverImage: imageUrl,
                recordLable: recordName,
                albumReleasedOn: value
            }).then(response=>{
                if(response.data.message){
                    setLoadAgain(!loadAgain)
                    handleClose()
                    setOpenLoad(false)
                    setAddingInfo(true)
                    setValue(new Date())
                    setImage("")
                    setAlbumName("")
                    setRecordName("")
                    setImageUrl("")
                }
            }).catch(err=>console.log(err))
        }
        if(imageUrl) addAlbum()
    },[imageUrl]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleAlbumClose = () =>{
        setAddingInfo(false)
    }
    
    const postDetails = async() =>{
        setOpenLoad(true)
        if(image !== ""){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","gamers")
            data.append("cloud_name","dk3dwxicc")
            await fetch("https://api.cloudinary.com/v1_1/dk3dwxicc/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                setImageUrl(data.url)
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            setImageUrl(require("../albumart.png").default)
        }
    };

    return (
        <Box sx={{background:'#9fbfdf'}}>
            <Container sx={{pt:5, pb: 5}} maxWidth="lg" >
                <Box sx={{flexGrow: 1}} >
                    <Grid container spacing={2} columns={12}>
                        {completeList.map((element, index)=>{
                            if(element.isSong) return(
                                <Grid item xs={12} sm={6} md={3} key={index} >
                                    <Card style={{textDecoration: "none", backgroundColor:"#99CCFF" }}>
                                        <CardMedia
                                            component="img"
                                            image={element.cover}
                                            alt={element.name}
                                            style={{width:'100%', backgroundImage: `url(${require("../albumart.png").default})`, backgroundSize:'contain', backgroundPosition:'center'}}
                                        />
                                        <CardContent sx={{background: 'white'}}>
                                            <Box sx={{display: 'flex'}}>
                                                <Typography gutterBottom sx={{flexGrow: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} variant="h5" component="div">
                                                    {element.name}
                                                </Typography>
                                                <Typography gutterBottom sx={{margin:'auto', mb: 0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} variant="body2" component="div">
                                                    {element.duration}
                                                </Typography>
                                            </Box>
                                            <Typography gutterBottom variant="body2" component="div" >
                                                Song
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                            else return(
                                <Grid item xs={12} sm={6} md={3} key={index} >
                                    <Card component={Link} to={"/album/"+element.album_id} style={{textDecoration: "none", backgroundColor:"#99CCFF" }}>
                                        <CardMedia
                                            component="img"
                                            image={element.cover}
                                            alt={element.name}
                                            style={{width:'100%', backgroundImage: `url(${require("../albumart.png").default})`, backgroundSize:'contain', backgroundPosition:'center'}}
                                        />
                                        <CardContent sx={{background: 'white'}}>
                                            <Typography gutterBottom sx={{flexGrow: 1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}} variant="h5" component="div">
                                                {element.name}
                                            </Typography>
                                            <Typography gutterBottom variant="body2" component="div" >
                                                Album
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            </Container>
            <br />
            <IconButton color="success" onClick={handleClickOpen} sx={{p: 0, m: 0, position: 'fixed',bottom: '0', right: '0', zIndex:'2'}} component="div">
                <AddCircle color="primary" sx={{ fontSize: 100 }} />
            </IconButton>
            <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Add Album</DialogTitle>
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Box sx={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', width:'97%' }}>
                        <Button variant="contained" component="label">
                            Upload File
                            <input
                                type="file"
                                autoComplete="off"
                                onChange={(e)=>setImage(e.target.files[0])}
                                hidden
                            />
                        </Button>
                        <Box>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={()=>postDetails()}>Add</Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog open={openLoad}>
                <DialogContent sx={{textAlign:'center'}}>
                    <CircularProgress sx={{margin:'auto'}} />
                    <Typography variant="h6" >
                        Adding
                    </Typography>
                </DialogContent>
            </Dialog>
            <Dialog open={addingInfo} onClose={handleAlbumClose}>
                <DialogContent>
                    <Typography variant="h5">
                        Album Added
                    </Typography>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
