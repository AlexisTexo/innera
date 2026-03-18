var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// en app.js o en routes simple:
router.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});


module.exports = router;
