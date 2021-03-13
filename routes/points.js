const express = require('express');
const router = express.Router();

let totalPoints = 0;
let payerPoints = {
  "DANNON": 1000,
  "UNILEVER": 0,
  "MILLER COORS": 5300
};
let pointTransactions = [];

// all routes in here are starting with /users
router.get('/', (req, res) => {
  res.send(payerPoints);
});

router.post('/', (req, res) => {
  let transaction = req.body;
  pointTransactions.push(transaction);
  res.send(`Points added:\n${transaction}`)
  console.log(pointTransactions)
})

console.log(pointTransactions)

module.exports = router;