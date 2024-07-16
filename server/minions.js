const express = require('express');
const { 
    getAllFromDatabase, 
    addToDatabase, 
    getFromDatabaseById, 
    updateInstanceInDatabase, 
    deleteFromDatabasebyId
} = require('./db');
const minionsRouter = express.Router();

// Do data validation on minionIDd
minionsRouter.param('minionId', (req, res, next, id) => {
    let minionId = Number(id);
    try {
        const found = getFromDatabaseById('minions', minionId);
        if (found) {
            req.minion = found;
            next();
        } else {
            res.status(404).send();
            next(new Error('No minion found with this ID'));
        };
    } catch (err) {
        next(err);
    }
});

// GET /api/minions to get an array of all minions.
minionsRouter.get('/', (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    if(minions) {
        res.send(minions);
    } else {
        res.status(404).send('Couldn\'t find any minions!');
    }
});

// POST /api/minions to create a new minion and save it to the database.
minionsRouter.post('/', (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion)
});

// GET /api/minions/:minionId to get a single minion by id
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

// PUT /api/minions/:minionId to update a single minion by id.
minionsRouter.put('/:minionId', (req, res, next) => {
    const updatedMinion = updateInstanceInDatabase('minion', req.body);
    res.send(updatedMinion);
});

// DELETE /api/minions/:minionId to delete a single minion by id.
minionsRouter.delete('/:minionId', (req, res, next) => {
    const minionDeleted = deleteFromDatabasebyId('minions', req.minion.id);
    minionDeleted ? res.status(204) : res.status(500);
    res.send();

});

// Work router for handling work-related routes
const workRouter = express.Router({mergeParams: true})
minionsRouter.use('/:minionId/work', workRouter);

// Middleware to validate workId
workRouter.param('workId', (req, res, next, id) => {
    const workId = Number(id);
    const work = getFromDatabaseById('work', workId);
    if (work) {
        req.work = work;
        next();
    } else {
        res.status(404).send();
    }
});

// GET /api/minions/:minionId/work to get an array of all work for the specified minion
workRouter.get('/', (req, res, next) => {
    const findMinionWork = getFromDatabaseById('work', req.minion.id);
    minionWork = findMinionWork ? [findMinionWork] : [];
    res.send(minionWork);
});

workRouter.post('/', (req, res, next) => {
    const workToAdd = req.body;
    workToAdd.minionId = req.minion.id;
    const newWork = addToDatabase('work', workToAdd);
    res.status(201).send(newWork);
})


module.exports = minionsRouter;