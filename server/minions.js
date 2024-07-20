const express = require('express');
const morgan = require('morgan');
const { 
    getAllFromDatabase, 
    addToDatabase, 
    getFromDatabaseById, 
    updateInstanceInDatabase, 
    deleteFromDatabasebyId
} = require('./db');
const minionsRouter = express.Router();

// Use logging middleware
minionsRouter.use(morgan('dev'));

// Do data validation on minionId
minionsRouter.param('minionId', (req, res, next, id) => {
    let minionId = Number(id);

    if (isNaN(minionId)) {
        return res.status(404).send('Invalid minion ID');
    }

    try {
        const found = getFromDatabaseById('minions', minionId);
        if (found) {
            req.minion = found;
            next();
        } else {
            res.status(404).send();
        };
    } catch (err) {
        next(err);
    }
});

// Do data validation on workId
minionsRouter.param('workId', (req, res, next, id) => {
    let workId = Number(id);

    if (isNaN(workId)) {
        return res.status(404).send('Invalid work ID');
    }

    try {
        const found = getFromDatabaseById('work', workId);
        if (found) {
            req.work = found;
            next();
        } else {
            res.status(404).send();
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
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
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
});

// PUT /api/minions/:minionId/work/:workId to update a single work by id.
workRouter.put('/:workId', (req, res, next) => {
    if (req.work.minionId !== req.minion.id) {
        res.status(400).send('A work ID with the wrong minion ID is requested');
    }
    const updatedWork = updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
})

// DELETE /api/minions/:minionId/work/:workId to delete a single work by id.
workRouter.delete('/:workId', (req, res, next) => {
    const workDeleted = deleteFromDatabasebyId('work', req.work.id);
    workDeleted ? res.status(204) : res.status(404);
    res.send();
})

module.exports = minionsRouter;