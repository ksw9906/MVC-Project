const models = require('../models');
const mongoose = require('mongoose');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    weapon: req.body.weapon,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  return newDomo.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ redirect: '/maker' });
  });
};

const removeDomo = (req, res) => {
  const convertId = mongoose.Types.ObjectId;
  Domo.DomoModel.find({
    name: req.body.name,
    owner: convertId(req.session.account._id) }).remove().exec((err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }
      return res.json({ redirect: '/maker' });
    });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.removeDomo = removeDomo;
