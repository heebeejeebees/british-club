var jwt = require('jsonwebtoken');
var constants = require('../../constants');

function verifyToken(req, res, next) {

  var token = req.headers['x-access-token'];
  if (!token)
  {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(
    token, 
    constants.TOKEN_SECRET, 
    function(err, decoded) 
    {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      req.currentuser = {
                          username: decoded.username
                        }

      next();
    });
}

module.exports = verifyToken;