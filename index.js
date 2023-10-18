// Express Server
const connectToMongo = require('./db');
connectToMongo()
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// All Path

// admin path
app.use('/api/admin/',require('./routes/admin.js'))

// controller path
app.use('/api/controller/',require('./routes/controller.js'))

// Head Coach path
app.use('/api/headcoach/',require('./routes/headcoach.js'));

// coach path
app.use('/api/coach/',require('./routes/coach.js'));

// notes path
app.use('/api/notes/',require('./routes/notes.js'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


