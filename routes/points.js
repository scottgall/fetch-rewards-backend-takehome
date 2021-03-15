const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let totalPoints = 0;
let payerPoints = {};
let pointTransactions = [
  {"payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z"},
  {"payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z"} 
];

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
    var points = req.body['points']
    console.log(points)
    
    if(points <= 0) {
      return res.status(422).json({ error: "Unable to spend points", reason: "points param must be positive integer above 0"})
    }

    var spent = {}


    // if ((!payerPoints[payer] && points < 0) || ((payerPoints[payer] + points) < 0)) {
    //   return res.status(422).json({ error: "Unable to add transaction", reason: "Payer balance can't go negative"});
    // } else if (!payerPoints[payer]) {
    //   payerPoints[payer] = points
    // } else {
    //   payerPoints[payer] += points
    // }

    // totalPoints += points
    
    // if (points < 0) {
    //   absPoints = Math.abs(points);
    //   console.log(absPoints)
      var removeIndex = [];

      var counter = 0;
      while (points > 0) {
        var transPayer = pointTransactions[counter]['payer']
        console.log('payer: ', transPayer)
        var transPoints = pointTransactions[counter]['points']
        console.log('points', transPoints)
        if (pointTransactions[counter]['points'] === points) {
          !pointTransactions[counter]['payer'] in spent ? spent[[pointTransactions][counter]['payer']] = points : spent[[pointTransactions][counter]['payer']] += points;
          points = 0
          removeIndex.push(counter)
        } else if (transPoints > points) {
          transPayer in spent ? spent[transPayer] += points : spent[transPayer] = points;
          pointTransactions[counter]['points'] -= points
          points = 0
          console.log(pointTransactions[counter])
        } else if (pointTransactions[counter]['points'] < points) {
          pointTransactions[counter]['payer'] in spent ? spent[[pointTransactions][counter]['payer']] = pointTransactions[counter]['points'] : spent[[pointTransactions][counter]['payer']] += pointTransactions[counter]['points'];
          points -= pointTransactions[counter]['points']
          removeIndex.push(counter)
        }
        counter++
      }

      console.log(removeIndex)
      // for (i=removeIndex-1; i >= 0; i--) {
      //   pointTransactions.splice(removeIndex[i],1);
      // }

    // if (points > 0) {
    //   pointTransactions.push(req.body);
    //   pointTransactions = pointTransactions.sort((a,b) => b.timestamp - a.timestamp);
    // }
    // for (i=0;i<pointTransactions.length;i++) {
    //   console.log(pointTransactions[i]);
    // };      
    // console.log(payerPoints)
    // console.log(`total ${totalPoints}`)
    // console.log('----------------------')

    console.log(spent)
    res.status(200).json({ success: "transaction added", transaction: spent})
});


module.exports = router;