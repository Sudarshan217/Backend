const express = require('express');
const Router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/notes');

Router.get(('/getnotes'), fetchuser, async (req, res) => {
    // find user notes with the help of user id 
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
})

module.exports = Router

