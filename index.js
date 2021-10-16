const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const port = 8000;

require('dotenv').config()

require('./models/album')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex:true
})

mongoose.connection.on('connected', ()=>{
    console.log('Connected to Mongodb.')
})

mongoose.connection.on('error', (err)=>{
    console.log('Connetion error: ', err)
})

app.use(express.json())
app.use(cors())
app.use('/v3', require('./routes/album'))

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))