import React from 'react'
import { Link } from 'react-router-dom'
import { Box, AppBar, Typography, Toolbar, Divider } from '@mui/material'

export default function Navbar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Box style={{ width: '100%' }} sx={{ display: 'flex', p: 1 }}>
                        <Box sx={{ p: 1, flexGrow: 1, display: 'flex' }}>
                            {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, pt:1 }}>
                                <Menu />
                            </IconButton> */}
                            <Typography style={{display:'inline', margin: 'auto 0', textDecoration: 'none'}} variant="h6" color="inherit" component={Link} to='/' >
                                Gamers Netork
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', p: 1}}>
                            <Typography style={{display:'inline', margin: 'auto', textDecoration: 'none'}} variant="h6" color="inherit" component={Link} to='/' >
                                All
                            </Typography>
                            <Divider orientation="vertical" variant="middle" sx={{m: 1, background: 'white'}} flexItem/>
                            <Typography style={{display:'inline', margin: 'auto', textDecoration: 'none'}} variant="h6" color="inherit" component={Link} to='/albums' >
                                Albums
                            </Typography>
                            <Divider orientation="vertical" variant="middle" sx={{m: 1, background: 'white'}} flexItem/>
                            <Typography style={{display:'inline', margin: 'auto', textDecoration: 'none'}} variant="h6" color="inherit" component={Link} to='/songs' >
                                Songs
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
