const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

let totalPoints = 0;
let payerPoints = {
  "UNILEVER": 0,
  "MILLER COORS": 0
};
let pointTransactions = [];

let transactionKeys = ['payer', 'points', 'timestamp']
function validateKeys(obj) {
  return transactionKeys.every({}.hasOwnProperty.bind(obj));
};


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
    pointTransactions.push(req.body)
    for (i=0;i<pointTransactions.length;i++) {
      console.log(pointTransactions[i]);
    };
    while points >= 0
    console.log(payerPoints)
    console.log('----------------------')
    res.status(200).json({ success: "transaction added", transaction: req.body})
});

module.exports = router;