var express = require('express');
const pgp = require('pg-promise')()
let dataBase = pgp('postgres://mtepe:mtepe123@localhost:5432/seller_db')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  dataBase.any("SELECT e.employee_code AS id, sum(fb.quantity) AS cantidad, sum(fb.quantity*fb.unit_price) AS dinero\n" +
      "       FROM fb_header fh\n" +
      "        INNER JOIN employee e on fh.employee_code = e.employee_code\n" +
      "        INNER JOIN fb_body fb on fh.no_bill = fb.no_bill GROUP BY e.employee_code;")
      .then(rows=> {
        res.json({result: rows})
      })
      .catch(errorQuery => {
        res.json({error: errorQuery})
      })
});

module.exports = router;
