const jwt = require('jsonwebtoken')
var constants = require('../constants');

const auth = async(req, res, next) => {
  try
  {
    token = req.session.token;
    key = req.session.key;
    
    if (!token || !key || key != "security"){
      res.statusMessage="No token provided.";
      console.log(constants.SECURITY_PORTAL_NAME)
      return res.redirect(constants.SECURITY_PORTAL_NAME + "/login?nextPage="+req.originalUrl);
      //return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
  
    decoded = jwt.verify(token, constants.SECURITY_PORTAL_TOKEN_SECRET);
    req.userId = decoded.id;

    next();
  }
  catch (ex)
  {
    console.log(ex)
    res.statusMessage = "Failed to authenticate token.";
    return res.redirect(constants.SECURITY_PORTAL_NAME + "/login");
  }
}
module.exports = auth