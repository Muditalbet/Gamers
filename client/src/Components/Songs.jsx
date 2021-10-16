import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import { Box, Container, IconButton, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material'
import { AddCircle } from '@mui/icons-material'

export default function Songs() {
    const [completeList, setCompleteList] = useState([]);

    useEffect(()=>{
        async function fetchList(){
            let url = process.env.REACT_APP_URL + "v3/getSongs"
            await Axios.get(url).then(response=>{
                if(response.data) setCompleteList(response.data)
            }).catch(err=>console.log(err))
        }
        fetchList()
    },[])

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
                                            image={require("../albumart.png").default}
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
                            else return null
                        })}
                    </Grid>
                </Box>
            </Container>
            <br />
        </Box>
    )
}
