const config = require('config');

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    
    console.log("run 'export vidly_jwtPrivateKey=mySecretKey' on your MAC terminal to set this jwtPrivateKey");
  
    console.log("or run 'set vidly_jwtPrivateKey=mySecretKey' on your windows terminal to set this jwtPrivateKey");
    process.exit(1);
  }
};