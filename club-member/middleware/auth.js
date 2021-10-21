const jwt = require('jsonwebtoken')
var constants = require('../constants');

const auth = async(req, res, next) => {
  try
  {
    token = req.session.token;
    key = req.session.key;
    
    if (!token || key){
      res.statusMessage="No token provided.";
      console.log(constants.APPLICATION_NAME)
      return res.redirect(constants.APPLICATION_NAME + "/login");
      //return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
  
    decoded = jwt.verify(token, constants.TOKEN_SECRET);
    req.userId = decoded.id;

    next();
  }
  catch (ex)
  {
    console.log(ex)
    res.statusMessage = "Failed to authenticate token.";
    return res.redirect(constants.APPLICATION_NAME + "/login");
  }
}
module.exports = auth