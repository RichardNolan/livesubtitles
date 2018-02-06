require('dotenv').load();
var watson  = require('watson-developer-cloud/speech-to-text/v1');
var fs      = require('fs');

var speech_text = new watson ({
  username: process.env.WATSONUSERNAME,
  password: process.env.WATSONPASSWORD
});
var stream = speech_text.createRecognizeStream({ content_type: 'audio/wav' });
fs.createReadStream(__dirname + '/resources/speech.wav').pipe(stream);
stream.pipe(fs.createWriteStream('transcription.txt'));

// listen for 'data' events for just the final text
// listen for 'results' events to get the raw JSON with interim results, timings, etc.

stream.setEncoding('utf8'); 

stream.on('data', data=>console.log(data))

module.exports = speech_text;