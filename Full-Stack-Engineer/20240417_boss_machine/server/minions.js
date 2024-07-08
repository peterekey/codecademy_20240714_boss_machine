const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById } = require('./db');
const minionsRouter = express.Router();
const workRouter = express.Router({mergeParams: true})

// Do data validation on minionIDd
minionsRouter.param('minionId', (req, res, next, id) => {
    let minionId = Number(id);
    try {
        const found = getFromDatabaseById('minions', minionId);
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
    // console.log(minions);
    if(minions) {
        // console.log('success!')
        res.send(minions);
    } else {
        res.status(404).send('Couldn\'t find any minions!');
    }
});

// POST /api/minions to create a new minion and save it to the database.
minionsRouter.post('/', (req, res, next) => {
    // console.log(req.body)
    const receivedMinion = addToDatabase('minions', req.body);
    res.status(201).send(receivedMinion)
})

// GET /api/minions/:minionId to get a single minion by id
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
})

// GET /api/minions/:minionId/work to get an array of all work for the specified minion
minionsRouter.use('/:minionId/work', workRouter);

workRouter.get('/', (req, res, next) => {
    const minionWork = getFromDatabaseById('work', req.minion.id);
    // console.log(minionWork);
    // req.minion.work = minionWork;
    req.work = [minionWork];
    // console.log(req.minion);
    res.send(req.work);
})


module.exports = minionsRouter;