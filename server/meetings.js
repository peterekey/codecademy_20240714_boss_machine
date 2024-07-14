const express = require('express');
const { getAllFromDatabase, addToDatabase, createMeeting, deleteAllFromDatabase } = require('./db');
const meetingsRouter = express.Router();

// GET api/meetings to get an array of all meetings
meetingsRouter.get('/', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    if (meetings) {
        res.send(meetings);
    } else {
        res.status(404).send('Couldn\'t find any meetings!');
    }
});

// POST api/meetings to automatically create a new meeting and save it to the database
meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = createMeeting();
    const meeting = addToDatabase('meetings', newMeeting);
    res.status(201).send(meeting);
})

// DELETE /api/meetings to delete all meetings from the database
meetingsRouter.delete('/', (req, res, next) => {
 deleteAllFromDatabase('meetings');
 res.status(204).send();
})

module.exports = meetingsRouter; 