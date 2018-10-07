/**
 Demo Plugin
*/
const express = require('express')
const router = express.Router()

//Add your custom code here

// Middleware
function authorize(req, res, next) {
 // if (req.user === 'farmer') {
   next()
 // } else {
 //   res.status(403).send('Forbidden')
// }
}

// Domestic animals page
router.get('/demo', authorize, function(req, res) {
  res.send('["Cow", "Horse", "Sheep"]')
})

//Always end with this
module.exports = router