import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Box } from '@mui/material'

import Navbar from './Components/Navbar'
import Home from './Components/Home'
import Albums from './Components/Albums'
import Songs from './Components/Songs'
import Album from './Components/Album'

export default function App() {
  return (
    <Box>
      <Router>
        <Navbar />
        <Route exact path='/' component={Home} />
        <Route exact path='/albums' component={Albums} />
        <Route exact path='/songs' component={Songs} />
        <Route exact path='/album/:id' component={Album} />
      </Router>
    </Box>
  )
}
