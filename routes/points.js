const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let totalPoints = 0;
let payerPoints = {};
let pointTransactions = [];

// get points balance
router.get('/', (req, res) => {
  res.send(payerPoints);
});

// add transaction
router.post('/', [
  body('payer').isString().toUpperCase(),
  body('points').isInt(),
  body('timestamp').isISO8601(),
  body().custom(body => {
    const keys = ['payer', 'points', 'timestamp'];
    return Object.keys(body).every(key => keys.includes(key));
  }).withMessage('Extra parameters were sent. Params restricted to: payer:<str>, points:<int>, timestamp:<ISO8601>')
], (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).send(errors.array({ onlyFirstError: true}))
    next();
}, (req, res) => {

    var payer = req.body.payer
    var points = req.body.points

    if (points == 0) {
      return res.status(422).json({ error: "Unable to add transaction", reason: "Points must be a positive or negative integer"})
    }

    if ((!payerPoints[payer] && points < 0) || ((payerPoints[payer] + points) < 0)) {
      console.log('hello')
      return res.status(422).json({ error: "Unable to add transaction", reason: `Payer balance can't go negative. ${payer} has ${!payerPoints[payer] ? 0 : payerPoints[payer]} points in account` });
    } else if (!payerPoints[payer]) {
      payerPoints[payer] = points
    } else {
      payerPoints[payer] += points
    }

    totalPoints += points
    
    if (points < 0) {

      var absPoints = Math.abs(points);
      var removeIndex = [];
      var counter = pointTransactions.length - 1;


      while (absPoints > 0) {
        var transPayer = pointTransactions[counter]['payer'];
        var transPoints = pointTransactions[counter]['points'];
        if (transPayer === payer) {
          if (transPoints === absPoints) {
            absPoints = 0
            removeIndex.push(counter)
          } else if (transPoints > absPoints) {
            pointTransactions[counter]['points'] -= absPoints
            absPoints = 0
          } else {
            removeIndex.push(counter)
            absPoints -= transPoints
          }
        }
        counter--
      }

      for (i=0;i<removeIndex.length;i++) {
        pointTransactions.splice(removeIndex[i],1);
      }

    }

    if (points > 0) {
      pointTransactions.push(req.body);
      pointTransactions.sort(function(a, b) {
        return (a.timestamp < b.timestamp) ? -1 : ((a.timestamp > b.timestamp) ? 1 : 0);
      });
    }
    console.log(pointTransactions)

    res.status(200).json({ success: "transaction added", transaction: req.body})
});

// spend points
router.post('/spend', [
  body('points').isInt(),
  body().custom(body => {
    const keys = ['points'];
    return Object.keys(body).every(key => keys.includes(key));
  }).withMessage('Extra parameters were sent. Params restricted to: points:<int>')
], (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).send(errors.array({ onlyFirstError: true}))
    next();
}, (req, res) => {
    var points = req.body.points
    
    if(points <= 0) {
      return res.status(422).json({ error: "Unable to spend points.", reason: "Points param must be positive integer above 0."})
    }
    if(points > totalPoints) {
      return res.status(422).json({ error: "Unable to spend points.", reason: `Only ${totalPoints} points available to spend.`})
    }

    var spent = {}

    var removeIndex = [];

    var counter = 0;
    while (points > 0) {
      var transPayer = pointTransactions[counter]['payer']
      var transPoints = pointTransactions[counter]['points']
      if (transPoints == points) {
        transPayer in spent ? spent[transPayer] += points : spent[transPayer] = points;
        payerPoints[transPayer] -= points
        points = 0
        removeIndex.push(counter)
      } else if (transPoints > points) {
        transPayer in spent ? spent[transPayer] += points : spent[transPayer] = points;
        pointTransactions[counter]['points'] -= points
        payerPoints[transPayer] -= points
        points = 0
      } else {
        spent[transPayer] = transPoints;
        points -= transPoints
        payerPoints[transPayer] -= transPoints
        removeIndex.push(counter)
      }
      counter++
    }

    var spentList = [];
    for (const payer in spent) {
      spentList.push({ "payer": payer, "points": spent[payer]*-1})
    }
    res.status(200).send(spentList)
});


module.exports = router;