const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let totalPoints = 0;
let payerPoints = {};
let pointTransactions = [];

// all routes in here are starting with /users
router.get('/', (req, res) => {
  res.send(payerPoints);
});

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
    let payer = req.body.payer
    let points = req.body.points

    if ((!payerPoints[payer] && points < 0) || ((payerPoints[payer] + points) < 0)) {
      return res.status(422).json({ error: "Unable to add transaction", reason: "Payer balance can't go negative"});
    } else if (!payerPoints[payer]) {
      payerPoints[payer] = points
    } else {
      payerPoints[payer] += points
    }

    totalPoints += points
    
    if (points < 0) {
      absPoints = Math.abs(points);
      console.log(absPoints)
      removeIndex = [];

      var counter = pointTransactions.length - 1;
      while (absPoints > 0) {
        if (pointTransactions[counter]['payer'] === payer) {
          if (pointTransactions[counter]['points'] === absPoints) {
            absPoints = 0
            removeIndex.push(counter)
          } else if (pointTransactions[counter]['points'] > absPoints) {
            pointTransactions[counter]['points'] -= absPoints
            absPoints = 0
          } else if (pointTransactions[counter]['points'] < absPoints) {
            removeIndex.push(counter)
            absPoints -= pointTransactions[counter]['points']
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
      pointTransactions = pointTransactions.sort((a,b) => b.timestamp - a.timestamp);
    }
    // for (i=0;i<pointTransactions.length;i++) {
    //   console.log(pointTransactions[i]);
    // };      
    // console.log(payerPoints)
    // console.log(`total ${totalPoints}`)
    // console.log('----------------------')
    res.status(200).json({ success: "transaction added", transaction: req.body})
});



module.exports = router;