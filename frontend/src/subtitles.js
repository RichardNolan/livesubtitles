import React, { Component } from 'react'
import mic from 'watson-speech/speech-to-text/recognize-microphone'
class Subtitles extends Component {
    
    
    render () {
        return (
            <div>
                <button onClick={this.listen.bind(this)}>Listen</button>
            </div>
        )
    }

   
    listen(){
        fetch('http://localhost:3001/api/speech-to-text/token')
            .then(response=> response.text())
            .then(token=> {
                const stream = mic({
                    token: token,
                    objectMode: true,
                    format: false
                });
                stream.on('data', data=>{console.log(data)});
                stream.on('error', err=>{console.log(err) });
                // document.querySelector('#stop').onclick = stream.stop.bind(stream);
            })
            .catch(error=>{console.log(error)});
    }
}

export default Subtitles