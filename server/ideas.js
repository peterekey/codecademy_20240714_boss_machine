const express = require('express');
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const ideasRouter = express.Router();

// Do data validation on ideaId
ideasRouter.param('ideaId', (req, res, next, id) => {
    let ideaId = Number(id);

    if (isNaN(ideaId)) {
        return res.status(400).send('Invalid idea ID');
    }

    try {
        const found = getFromDatabaseById('ideas', ideaId);
        if (found) {
            req.idea = found;
            next();
        } else {
            res.status(404).send('No idea with this ID found');
        }
    } catch(err) {
        next(err);
    }
})

// GET /api/ideas to get an array of all ideas
ideasRouter.get('/', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    ideas ? res.status(200) : res.status(404);
    res.send(ideas);
});

// POST /api/ideas to create a new idea and save it to the database.
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
});

// GET /api/ideas/:ideaId to get a single idea by id.
ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
})

// PUT /api/ideas/:ideaId to update a single idea by id.
ideasRouter.put('/:ideaId', (req, res, next) => {
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    res.status(200).send(updatedIdea);
})

// DELETE /api/ideas/:ideaId to delete a single idea by id.
ideasRouter.delete('/:ideaId', (req, res, next) => {
    const ideaDeleted = deleteFromDatabasebyId('ideas', req.idea.id);
    ideaDeleted ? res.status(204) : res.status(500);
    res.send();
})

module.exports = ideasRouter;