/**
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
 *
 * https://restfulapi.net/http-methods/
 * https://restfulapi.net/http-status-codes/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * https://restfulapi.net/rest-put-vs-post/
 **/

const port = 8350; 
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const fs = require('fs');
const Wordle = require("./model.js");

const database = {};
var firstWordle = null;
var words = ["words"]; // just in case!!

// store all of the player is playing the game
const usernameList = []
// the WebSocket






/******************************************************************************
 * word routines
 ******************************************************************************/

// Read in all words, lets hope this finished before we need the words!
// https://www.memberstack.com/blog/reading-files-in-node-js
fs.readFile('./words.5', 'utf8', (err, data) => {
        if (err)console.error(err);
        else words = data.split("\n");
});

/******************************************************************************
 * middleware
 ******************************************************************************/
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// https://expressjs.com/en/starter/static-files.html
// app.use(express.static('static-content')); 

/******************************************************************************
 * routes
 ******************************************************************************/
app.get('/api/username/', function (req, res) {
	let username = req.cookies.username;
	if (!username) {
		let minute = 60 * 1000;
		let wordle=new Wordle(words);
		username=wordle.getUsername();
		res.cookie("username", username, { maxAge: minute });
		res.status(200);
		res.json({"username":username});
	} else {
		res.json({"username":req.cookies.username});
	}	
});

app.put('/api/username/:username/newgame', function (req, res) {
	let username=req.params.username;
	// console.log(username);
	if(!(username in database)){
		// so the user join the game
		usernameList.push(username)

		// first check if it is empty
		// If it is empty, then this wordle is the
		// first wordle. So set the targets of other worder to the targer
		// of the first wordle
			let wordle=new Wordle(words);
			if(firstWordle===null){
				firstWordle = wordle;
				// console.log("The first username: "+ wordle.getUsername())
				// console.log("The only target should be: " + wordle.target)
			}
			else{
				console.log("set target of "+ username + " to " + firstWordle.target)
				console.log("Before set the target " + wordle.target)
				wordle.target=firstWordle.target
				console.log("After set the target " + wordle.target)
				// console.log("The following username: "+ wordle.getUsername())
			}
			wordle.setUsername(username);
			database[username]=wordle;
			console.log(username+" : " + wordle+" is added to the database")
	} 
	database[username].reset();

	res.status(200);
	res.json({"status":"created"});
});

// Add another guess against the current secret word
app.post('/api/username/:username/guess/:guess', function (req, res) {
	let username=req.params.username;
	let guess=req.params.guess;

	if(! username in database){
		res.status(409);
		res.json({"error":`${username} does not have an active game`});
		return;
	}

	var temp_wardle = database[username]
	temp_wardle.target = firstWordle.target
	var data = temp_wardle.makeGuess(guess);
	console.log("The target of the first wordle: "+ firstWordle.target)
	//console.log("The correct answer: " + temp_wardle.target)
	res.status(200);
	res.json(data);
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});

/////////////////////////////

var webSocketPort = 8351;
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({port: webSocketPort});
var messages=[];
var total_win = 0
var total_lost = 0
var join_number = usernameList.length


function changeFirstWordleTarget() {
    if (firstWordle !== null) {
        firstWordle.resetTarget();
		console.log("new target is "+firstWordle.target)
    }
}
// First initialize the curr_seconds and stop_seconds
var date = new Date()
var curr_seconds = date.getMinutes()*60 + date.getSeconds()
// 5 mins = 40 seconds
var stop_seconds = curr_seconds + 40
var sendMessage = true;


wss.broadcast = function(message){
	// for(let ws of this.clients){ 
	// 	ws.send(message); 
	// }

	// Alternatively
	// this.clients.forEach(function (ws){ ws.send(message); });
}


// wss: websocket server 
// ws: the websocket
wss.on('connection', function(ws) {
	join_number += 1
	ws.send("Hello from server to the client; one client connect to the server successfully");
    // Handle incoming messages from the client
    ws.on('message', function(data, isBinary) {
		const message = isBinary ? data : data.toString();
		if(message==='win'){
			console.log("The total win is increased by 1")
			total_win += 1
		}else if(message==='lost'){
			total_lost += 1
		}
		else if(message=="pause"){
			
		}

        console.log('Received message from client:', message);
        // Handle the received message here
    });

	ws.on('close', function(){
		join_number -= 1
		if(join_number < 0){join_number=0}
	})
    // Handle errors
    ws.on('error', function(error) {
        console.error('WebSocket error:', error);
    });

// set the 5:00 timer 
setInterval(function(){
	date = new Date()
	curr_seconds = date.getMinutes()*60 + date.getSeconds()
	
	let remain_seconds = stop_seconds - curr_seconds
	let mins = parseInt(remain_seconds/60) 
	// console.log("The mins: " + mins)
	if(mins < 10){
		mins = "0" + mins
	}
	else{mims = ""+ mins}
	let sec = remain_seconds%60
	if(mins==0 && sec==0){
		console.log("Check the the target should be reset")
		// when the 5 mins finished, update the current second and the stop seconds
		curr_seconds = date.getMinutes()*60 + date.getSeconds()
		stop_seconds = curr_seconds + 40
		sendMessage = false;
		ws.send(`target${firstWordle.target}`)
		setTimeout(() => {
            changeFirstWordleTarget();
			sendMessage = true;
			curr_seconds = date.getMinutes()*60 + date.getSeconds()
			stop_seconds = curr_seconds + 40
        }, 15000);
	}
	let time = null 
	if(sec>=10){
		time = mins + ":" + sec
	}
	else{
		time = mins + ":0" + sec
	}
	
	if(sendMessage){
	ws.send(time)
	ws.send(`total_win${total_win}`)
	ws.send(`total_lost${total_lost}`)
	ws.send(`join_number${join_number}`)
	}
	}, 1000);

});

// code: is the numeric status code incicate the reason
// reason: string describe the reason
wss.on("close", function(code, reason){
	console.log("The connection closes")
})

wss.on("error", function(error){
	console.log("There's an error: send from the server side: "+ error)

})

wss.on("message", function(data){
	console.log(typeof(data))
	console.log("received data: "+ data)
})
