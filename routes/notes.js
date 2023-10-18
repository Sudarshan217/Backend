const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Route 1: GET Request to fetch all the notes using: GET "/api/notes/getnotes" login required 
router.get(('/getnotes'), fetchuser, async (req, res) => {
    // find user notes with the help of user id 
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
})

// Route 2: POST Request to create a new notes using: POST "/api/notes/addnotes" login required
router.post(('/addnotes'), [body('title', 'Enter Your Title').isLength({ min: 3 }), body('description', 'Enter Your Description').isLength({ min: 3 })], fetchuser, async (req, res) => {
    // Validation check 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body
    const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id
    })
    const saveNotes = await notes.save()
    res.json(saveNotes)
})

// Route 3: PUT Request to update a existing notes using: PUT "/api/notes/update/:id" login required
router.put(('/update/:id'), fetchuser, async (req, res) => {

    // Destrucing 
    const { title, description, tag } = req.body

    // Create newobject Note
    const newObjectNote = {}
    if (title) { newObjectNote.title = title }
    if (description) { newObjectNote.description = description }
    if (tag) { newObjectNote.tag = tag }

    // Find the user and update the value
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
        return res.status(400).send("Id not found");
    }

    // Notes id and req id are not matched
    if (notes.user.toString() !== req.user.id) {
        return res.status(400).send('Not Allowed');
    }

    notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newObjectNote }, { new: true })
    res.send(notes);
})

// Route 4: DELETE Request to update a existing notes using: DELETE "/api/notes/delete/:id" login required
router.delete(('/delete/:id'), fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    const newObjectNote = {};
    if (title) (newObjectNote.title = title);
    if (description) (newObjectNote.description = description);
    if (tag) (newObjectNote.tag = tag);

    let notes = await Notes.findById(req.params.id);
    if (!notes) {
        return res.status(400).send("User id not Match");
    }
    if (notes.user.toString() !== req.user.id) {
        return res.status(400).send("Not Allowed");
    }
    notes = await Notes.findByIdAndDelete(req.params.id);
    return res.json({"Success":"Your notes is delete Successfully",notes:notes})

})

module.exports = router