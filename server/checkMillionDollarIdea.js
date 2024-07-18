const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    const ideaValue = Number(numWeeks) * Number(weeklyRevenue);
    if (!numWeeks || !weeklyRevenue || isNaN(ideaValue) || ideaValue < 1000000) {
        res.status(400).send('There\'s a problem with the idea!');
    } else {
        next();
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
