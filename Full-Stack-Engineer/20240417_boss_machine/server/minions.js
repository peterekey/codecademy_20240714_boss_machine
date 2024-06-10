const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById } = require('./db');
const minionsRouter = express.Router();

// Do data validation on minionIDd
minionsRouter.param('minionId', (req, res, next, id) => {
    let minionId = Number(id);
    try {
        const found = getFromDatabaseById('minions', id);
        if (found) {
            req.minion = found;
            next();
        } else {
            next(new Error('No minion found with this ID'));
        };
    } catch (err) {
        next(err);
    }
});

// GET /api/minions to get an array of all minions.
minionsRouter.get('/', (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    console.log(minions);
    if(minions) {
        res.send(minions);
    } else {
        res.status(404).send('Couldn\'t find any minions!');
    }
});

// POST /api/minions to create a new minion and save it to the database.
minionsRouter.post('/', (req, res, next) => {
    console.log(req.body)
    const receivedMinion = addToDatabase('minions', req.body);
    res.status(201).send(receivedMinion)
})

module.exports = minionsRouter;