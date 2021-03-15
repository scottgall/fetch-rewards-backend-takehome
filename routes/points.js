const express = require('express');
const router = express.Router();

let totalPoints = 0;
let payerPoints = {
  "DANNON": 1000,
  "UNILEVER": 0,
  "MILLER COORS": 5300
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

router.post('/', (req, res) => {
  console.log(validateKeys(req.body))
  let transaction = req.body;
  res.send(transaction)
})

module.exports = router;