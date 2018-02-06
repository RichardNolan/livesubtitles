require('dotenv').load();
var watson = require('watson-developer-cloud/text-to-speech/v1');


var textSpeech = new watson ({
  username: process.env.WATSONUSERNAME,
  password: process.env.WATSONPASSWORD
});


module.exports = textSpeech;