const express = require('express');
const { getAllFromDatabase } = require('./db');
const ideasRouter = express.Router();

// GET /api/ideas to get an array of all ideas
ideasRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    // console.log(ideas)
    if(ideas) {
        res.send(ideas);
    } else {
        res.status(404).send('Couldn\'t find any ideas!');
    }
});

module.exports = ideasRouter;