/**
 Demo Plugin
*/
const plugin = require('../../ngx-do-proxy').app;
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
plugin.get('/demo', authorize, function(req, res) {
  res.send('["Cow", "Horse", "Sheep"]')
})

