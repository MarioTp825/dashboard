const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
let dataBase = pgp('postgres://mtepe:mtepe123@localhost:5432/seller_db')
let content = {values: null, error: null}

dataBase.one("SELECT e.name_employee AS nombre, sum(fb.quantity) AS cantidad, sum(fb.quantity*fb.unit_price) AS dinero\n" +
    "       FROM fb_header fh\n" +
    "        INNER JOIN employee e on fh.employee_code = e.employee_code\n" +
    "        INNER JOIN fb_body fb on fh.no_bill = fb.no_bill GROUP BY e.employee_code;")
    .then(function (data) {
      content.values = data.value().rows
    })
    .catch(function (error) {
        content.error = error
    })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard', statisticsData: content });
});

module.exports = router;
