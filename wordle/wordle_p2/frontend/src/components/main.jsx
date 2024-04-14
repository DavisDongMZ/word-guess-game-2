import React from 'react';
import { api_getUsername, api_guess, api_newgame }  from './api'; 

// jsx: the javascript XML
// allow to write HTML like code within js
// It is commonly used in React to describe the
// structure of user interfaces
// Header is the new class we create as a class
class Letterbox extends React.Component {
	constructor(props) {
		super(props);
		
	  }
	render() {
	//   console.log("When render the letter box")
	  const letterbox  = this.props.letterbox;
	  const AllScoreMatrix = this.props.AllScoreMatrix;
	//   console.log(AllScoreMatrix)
	//   map returns a new array that contain the results of the callback function
	//   array.map(function(currValue(required), index(optional), array(optional)))
	//  currValue: the current value being process
	//  index: the index of the currValue
	//  apply the function to each element inside the array
	// letterbox: is an array
	// {} : used for block of code; function, loop, conditional
	const rows = letterbox.map((row, rowIndex) => {
		// the current row; add the color
		// console.log("rowIndex: "+rowIndex + " type " + typeof(rowIndex))
		// console.log("y: " + y + "type " + typeof(y))
		const isCurrentRow = rowIndex === this.props.y;
    
    	// Conditional style for enlarging the row
    	const rowStyle = isCurrentRow ? { transform: 'scale(1.1, 1.1)', transition: 'transform 0.5s ease' } : {};
			
			return(<tr key={`row${rowIndex}`} className={`row${rowIndex}`} style={rowStyle}>
		  	{row.map((cell, colIndex) => {
				// in js, when ise  arrow function, don't need to return if return a single expression
				//  However, if there's a block (if, for ...) of code and want to return sth from it, use return
				// (): when there's one expression
				// {}: when there's block of code
				var colorNum = AllScoreMatrix[rowIndex][colIndex];
				var color = "";
				if(colorNum===1){
					color = 'grey'
				}
				else if(colorNum===2){
					color = 'yellow'
				}
				else if(colorNum===3){
					color = 'green'
				}
				else{
					color = 'black'
				}
				// console.log("set the color")
				// console.log("The color is :" + color)
				return(
				<td key={`col${colIndex}`} className={`col${colIndex}`} style={{backgroundColor: color}}>
				{cell}
				</td>)
			}	
		  )}
		</tr>)
		
	});
  
	  return (
		<center>
		  <table className="letterbox">
			<tbody>
			  {rows}
			</tbody>
		  </table>
		</center>
	  );
	}
  }
  




  class Key1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  enlarged: false,
		  hovered: false // Define the hovered state
		};
	  }
	
	  handleClick = () => {
		this.props.key1PressedHandler(this.props.content);
		this.setState({ enlarged: true });
		setTimeout(() => {
		  this.setState({ enlarged: false });
		}, 500);
	  }
	
	  handleMouseEnter = () => {
		this.setState({ hovered: true });
	  }
	
	  handleMouseLeave = () => {
		this.setState({ hovered: false });
	  }

	render() {
		const { enlarged, hovered } = this.state; // Destructure hovered state
		var bgColor = this.props.color1;
		const className = enlarged ? "enlarged" : "";
		const hoverClass = hovered ? "hovered" : ""; // Use hovered state
		return (
		  <td onClick={this.handleClick} style={{ backgroundColor: bgColor }} className={`${className} ${hoverClass}`}
			onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
			{this.props.content} </td>
		);
	  }
  }
  
  class Keyboard extends React.Component {
	render() {
	  return (
		<center>
			{/* map function is used to iterate over each row in the keys array */}
		  {this.props.keys.map((row, rowIndex) => (
			// key attribute is a special attribute that used to help React identify which
			//  items have changed, are added or are removed in a list of child component 
			// key store the value of each key like A,B,C
			<table className="keyboardrow" key={`row${rowIndex}`}>
			  <tbody>
				<tr>
				  {row.map((key, colIndex) => {   
						var color = this.props.keyboardColor[rowIndex][colIndex];
						// console.log("Current color is: " + color)
						// console.log("The color matrix: " + this.props.keyboardColor)
					 return(
						<Key1
						key={`key${colIndex}`}
						content={key}
						key1PressedHandler={this.props.keyBoardClickHandler}
						color1 = {color}
					/>
					 )
					
					 })}
				</tr>
			  </tbody>
			</table>
		  ))}
		</center>
	  );
	}
  }

  class Play extends React.Component {
	constructor(props) {
	  super(props);
	  this.KeyboardOffHandler = this.KeyboardOffHandler.bind(this)
	  
	}

	KeyboardOffHandler = () => {
		console.log("the keyboard is off")
	}
	
	render() {
	  return (
		<div className="ui_top" id="ui_play">

			<center style={{fontSize:'30px'}}>
				<h3>global score</h3>
				<span className="material-symbols-outlined"> check_circle </span> {this.props.total_win} &nbsp;
				<span className="material-symbols-outlined"> help </span> {this.props.join_number} &nbsp;
				<span className="material-symbols-outlined"> cancel </span> {this.props.total_lost}</center>
			<center>Last round target was: {this.props.target}</center>
			<center style={{fontSize:'20px'}}>{this.props.target}</center>
		   <center style={{fontSize:'30px'}}>{this.props.timer}</center>
		  <Letterbox letterbox={this.props.letterbox} AllScoreMatrix={this.props.AllScoreMatrix} y ={this.props.y}/>
		  <br />
		  <br />
		  <Keyboard
			keys={this.props.keys}
			keyBoardClickHandler={this.props.KeyboardOn?this.props.handleKeyPress:this.KeyboardOffHandler} // Pass the key press handler
			AllScoreMatrix={this.props.AllScoreMatrix}
			// y is the row number of the letter box
			y = {this.props.y}
			keyboardColor = {this.props.keyboardColor}
		  />
		  <br />
		  <br />
		  {/* <center>
				{(!this.props.KeyboardOn) && <button style={{ background: 'red' }} onClick={this.props.newGameTimerHandler}>NEW GAME</button>}
		  </center> */}
		</div>
	  );
	}
  }


class Stats extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div className="ui_top">
			<center style={{ fontSize: 'xx-large' }}>
				<h1>personal score</h1>
				<span className="material-symbols-outlined"> check_circle </span> {this.props.winTimes} &nbsp;
				<span className="material-symbols-outlined"> cancel </span> {this.props.lostTimes}
			</center>
		</div>
		
	)}
}


class Instruction extends React.Component{
	constructor(props) {
		super(props);
	  }

	render() {
		return (
		<div className="ui_top">
			<div className="textblock"> 
				Take a look a mordle.io instructions.
			</div>
		</div>
	)}
}

class Home extends React.Component{
	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div className="ui_top">
		<div className="textblock"> 
			Classic
			<br/>
			You have 6 chances to guess the word, the first one to guess it wins. 
		</div>
		</div>
	)}
}

class Username extends React.Component{
	constructor(props) {
		super(props);
	}

	render(){
		return (
		    <div className="ui_top">
			<h2>username: {this.props.Username} </h2>
			</div>
	)}
}




class Header extends React.Component {
	constructor(props) {
	  super(props);
  }
	  
	render() {
		
	  return (
	  <>
	  <header>
		  <nav>
		  <span className="alignleft"></span>
		  <span className="aligncenter">
			  <a style={{ fontSize: 'x-large', textDecoration: 'underline' }} onClick={(e)=>this.props.iconClickHandler(e, "Home")} className={this.props.selectedButton==="Home"?'active': ''}>309DLE</a>
		  </span>
		  <span className="alignright">
			  <a onClick={(e) => this.props.iconClickHandler(e, "Username")} className={this.props.selectedButton==="Username"?'active': ''}><span className="material-symbols-outlined"> person </span></a>
			  <a onClick={(e) => this.props.iconClickHandler(e, "Play")} className={this.props.selectedButton==="Play"?'active': ''}><span className="material-symbols-outlined"> play_circle </span></a>
			  <a onClick={(e) => this.props.iconClickHandler(e, "Stats")} className={this.props.selectedButton==="Stats"?'active': ''}><span className="material-symbols-outlined"> leaderboard </span></a>
			  <a onClick={(e) => this.props.iconClickHandler(e, "Instruction")} className={this.props.selectedButton==="Instruction"?'active': ''}><span className="material-symbols-outlined"> help </span></a>
		  </span>
		  </nav>
	  </header>
	  {/* {this.state.selectedComponent} */}
	  </>
	)}
  }
  
  
   
  class Main extends React.Component {
	
	constructor(props) {
		super(props);
	  // We need to bind a function to this when we pass it as a callback funcation
	  // or event handler and we want to access this within that function
		this.state = {
		  selectedComponent: "Username",
		  Username: "",
		  wordleData: null,
		  gameStart: false,
		  // x: the current column index within the letterbox
		  // y: the current row index within the letter box
		  x:0,
		  deleteX:0,
		  y:0, 
		  full:false, 
		  empty: true,
		  letterbox: [
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ] ,
		  KeyboardOn : true,
		  
		  AllScoreMatrix : [[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
						   ],
		////////////////////////////    
		 winTimes: 0, 
		 lostTimes: 0,
		 
		 keyboardColor: [
			["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"],
			["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"],
			["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"]
		  ],
		  keys:[
			["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
			["A", "S", "D", "F", "G", "H", "J", "K", "L"],
			["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"]
		  ],
		  
		  connectToServer: false,
		  socket: null,
		  timer: null,
		  total_win: 0,
		  total_lost: 0,
		  join_number: 0,
		  target: "",
		  timeoutHandled: false
		};
	  //  store the wordle and username of each player inside the this.state
		this.iconClickHandler = this.iconClickHandler.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.handleKeyDelete = this.handleKeyDelete.bind(this)
		this.getUserName=this.getUserName.bind(this);
		this.getNewGame = this.getNewGame.bind(this);
		this.newGameTimerHandler = this.newGameTimerHandler.bind(this)
		this.handleKeyEnter = this.handleKeyEnter.bind(this)
		this.winHandler = this.winHandler.bind(this)
		this.changeColorHandler = this.changeColorHandler.bind(this)
		this.socketHandler = this.socketHandler.bind(this)
		this.disconnectHandler =this.disconnectHandler.bind(this)


		this.usernameHandler = this.usernameHandler.bind(this)
		api_getUsername(this.usernameHandler);
		
  }
  iconClickHandler = (e, name) =>{
	  console.log(name);
	  this.setState({selectedComponent: name});
	  
  }	

// This handler is used to update the keyboard entry color
// letter means each letter inside the guess
  changeColorHandler = (score, letter) => {
	// var temp = [... this.state.keyboardColor]
	// temp[rowIndex][colIndex] = color
	// this.setState({keyboardColor:temp})
	for(var rowIndex = 0; rowIndex < 3; rowIndex++){
		for (var colIndex=0; colIndex < 10; colIndex++){
			// console.log(this.state.keys[rowIndex][colIndex] + ", " + typeof(this.state.keys[rowIndex][colIndex]))
			if(this.state.keys[rowIndex][colIndex]===letter){
				// console.log("Find the letter")
				var currColor = this.state.keyboardColor[rowIndex][colIndex]
				// console.log("In the changeColorHandler, the currColor of the keyboard is: " +currColor)
				var color = "";
				// console.log("For the letter: " + letter + ", the color is: " + currColor)
				if(score===1 && currColor==='black'){
					color = 'grey'
				}
				else if(score===2 && currColor!='green'){
					color = 'yellow'
				}
				else if(score===3){
					color = 'green'
				}
				else{
					color = currColor
				}

				var tempMatrix = [... this.state.keyboardColor]
				// console.log(tempMatrix)
				tempMatrix[rowIndex][colIndex] = color
				this.setState({keyboardColor: tempMatrix})

				return;

			}
		}
	}
  }
  
  usernameHandler = (data) => {
	this.setState({Username: data["username"]})
	console.log("The username is setted")
	api_newgame(data["username"], this.getNewGame)
	console.log("The api_newGame is running")
  }
  handleKeyPress = (letter) => {
	  console.log(letter)
	  console.log("before the key press body")
	  console.log("the x: "+ this.state.x)
	  console.log("the deleteX: "+ this.state.deleteX)

	  if (letter === "DEL"){
		  this.handleKeyDelete(); 
		  return;}
	  if (letter === "ENTER"){
		  this.handleKeyEnter();
		  return;}
	  const x = this.state.x 
	  const y = this.state.y 
	  const letterbox = this.state.letterbox
	  const full = this.state.full	
	  if (full){return;}
	//   ... is the spread parameter
	//  use ... to make a shallow copy of the letter box
	// shallow copy: only copy the elements, but no reference
	//  which means when newLetterbox change, the letterbox won't change
	  const newLetterbox = [...letterbox];   //ES6 syntax, make a copy, update only readable
	  
	// accumulate each letter
	//   update the current row
	  newLetterbox[y][x] = letter;
	//   horizontal index 0 to 4 = 5 entries
	  if (x === 4) {
		// vertical index 0 to 5 = 6 entries
		if (y === 5){
			this.setState({letterbox: newLetterbox, full: true, deleteX: this.state.x});
			
		  } 
		else {
			// when x = 4; deleteX = x
			this.setState({ letterbox: newLetterbox, empty: false, deleteX: this.state.x});
		}
		console.log("This row is full")
	  } else {
		// when x < 4; deleteX = x-1
		this.setState({ x: x + 1, y: y, letterbox: newLetterbox, empty: false, deleteX: this.state.x});
		// console.log("the x increase by 1")
	  }
	//   console.log("after the keypress body, but before the render")
	//   console.log("the x: "+ this.state.x)
	//   console.log("the y: "+ this.state.y) 
	}


  
  getNewGame=(data)=>{
	//   console.log(data)
	  var wordleData=data['newgame']
	  this.setState({wordleData: wordleData})

  }

  getUserName=(data)=>{
		  var name = data['username']
		  api_newgame(name, this.getNewGame)
		  console.log("The api_newGame is running")
		  console.log("Api new_game is called")
		  this.setState({Username: name}) 
		  //  set state schedule a change to the stage, but it does not happen eventaully 
  }



	handleKeyDelete = () => {
		// const { x, y, letterbox, empty } = this.state;
		const deleteX = this.state.deleteX
		const y = this.state.y 
		const letterbox = this.state.letterbox
		const empty = this.state.empty

		if (empty) {return;}
		const newLetterbox = [...letterbox];
		this.setState({letterbox : newLetterbox})
		if (deleteX === 0) {
			// when x = 0; deleteX and x are equivalent
			newLetterbox[y][deleteX] = "";
			if (y === 0){
				this.setState( {x:deleteX, y:y, letterbox: newLetterbox, empty: true} );
			} else {
				this.setState( {letterbox:newLetterbox, full: false, x:deleteX});
			}
		} else {
			// deleteX move back; x should not change
			newLetterbox[y][deleteX] = "";
			this.setState( {deleteX:deleteX-1, y:y, letterbox: newLetterbox, full: false, x: deleteX});
		}
		// console.log("y: "+y + " x: "+ x);
	} 
	
	handleKeyEnter = ()=>{
		// If the guess is complete
		// console.log("The x is: " + this.state.x)
		// console.log("The y is: " + this.state.y)

		if(this.state.x==4){
			const guess = this.state.letterbox[this.state.y].join('')
			// console.log(guess)
			// console.log("Inside the handleKeyEnter, The api_guess is called")
			api_guess(this.state.Username, guess,this.guessCallBack)
			this.setState({empty: true})
			
		}else{
			alert("guess must be 5 alphabetic characters")
		}
	} 

	guessCallBack = (data) => {
		// console.log("The callback function is called")
		var rowIndex = this.state.y
		var matrixCopy = [...this.state.AllScoreMatrix]
		var sum = 0
		if(this.state.y <= 5 && data["error"] == ''){
			// This is the array store the previous guess
			// store the scores in an array
			var tempScore = data["score"]
						
			for (let i = 0; i < 5 ; i++){
				matrixCopy[rowIndex][i] = tempScore[i]['score']
				// 3: correct position; the user win if all of those 5 letters are in the correct positions
				// 3*5=15
				var score = tempScore[i]['score']
				var letter = this.state.letterbox[this.state.y][i]
				sum += score
				this.changeColorHandler(score, letter)
			}

			if(sum === 15 ){
				// when win a game, send a win message to the server
				this.state.socket.send("win")
				this.setState({x:0, y:this.state.y+1, AllScoreMatrix : matrixCopy, KeyboardOn: false, winTimes: this.state.winTimes+1, winTheRoll: true})
				return;
			}
			else if(this.state.y==5){
				// when lost a game, send a lost message to the server
				this.state.socket.send("lost")
				this.setState({x:0, y:this.state.y+1, AllScoreMatrix : matrixCopy, KeyboardOn: false, lostTimes: this.state.lostTimes+1, lostTheRoll: true})
				return;
			}
			
			this.setState({x:0, y:this.state.y+1, AllScoreMatrix : matrixCopy})
		}
		else{
			alert(data["error"])
		}
	}

	winHandler = ()=>{
		// If the user win the game, disable the keyboard
		this.setState(
			{KeyboardOn : false}
		)
	}
	newGameTimerHandler = () =>{
		// when the user finsh each roll of the game, click the newGameButton
		//  reset the keyboard and letter box; do not reset the stats
		//  basically, everything except the stats and username
		this.setState({
		  KeyboardOn:true,
		  x:0,
		  deleteX:0,
		  y:0, 
		  full:false, 
		  empty: true,
		  letterbox: [
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ['', '', '', '', ''],
		  ] ,

		  
		  AllScoreMatrix : [[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
						   ],
						   keyboardColor: [
							["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"],
							["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"],
							["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"]
						  ],
						  keys:[
							["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
							["A", "S", "D", "F", "G", "H", "J", "K", "L"],
							["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"]
						  ],
						  winTheRoll: false,
						  lostTheRoll: false,
						  timeoutHandled: false
		})
	}

	// 
	socketHandler = () =>{
		
		if (this.state.socket && this.state.socket.readyState === WebSocket.OPEN) {
			console.log("WebSocket connection already established.");
			return;
		}
		
		// Establish a new WebSocket connection
		console.log("Creating a new WebSocket connection.");
		const socket = new WebSocket(`ws://${window.location.hostname}:8351`);
		console.log(`ws://${window.location.hostname}:8351`)
		console.log(socket.readyState)
		console.log("Open the socket")
		socket.onopen = (event) => {
			console.log("Connected to the WebSocket server.");
			socket.send("Hello from the client side.");
			console.log("The socket should be stored")
			this.setState({socket: socket, connectToServer: true });
		};
	
		socket.onclose = (event) => {
			console.log("The user disconnected from the WebSocket.");
			console.log(event)
			// Optionally reset the WebSocket instance in state
			this.setState({ socket: null, connectToServer: false });
		};
	
		socket.onmessage = (event) => {
			const meg = event.data
			var win = 0
			var lost = 0
			var j_num = 0
			if(meg.includes(":")){
				// console.log("The time is: "+ meg)
				this.setState({timer: meg})
			}
			else if(meg.includes("total_win")){
				 win= parseInt(meg.substring("total_win".length))
				//  console.log("total_win: "+ win)
				 this.setState({total_win : win})
			}
			else if(meg.includes("total_lost")){
				lost = parseInt(meg.substring("total_lost".length))
				this.setState({total_lost: lost})
				// console.log("Total_lost: "+ lost)
			}
			else if(meg.includes("join_number")){
				j_num = parseInt(meg.substring("join_number".length))
				// console.log("join number: "+ j_num)
				this.setState({join_number: j_num})
			} else if(meg.includes("target")){
				this.setState({target: meg.slice(6)})
			} else{
				console.log("The stats message: "+ meg)
			}

			// this.setState({total_win: win, total_lost: lost, join_number: j_num})
		};
	
		socket.onerror = (event) => {
			console.error("WebSocket error:", event);
		};
		console.log("the state of the connection: " + socket.readyState)
	}

	
	disconnectHandler = () => {
		if (this.state.socket !== null) {
			console.log("Disconnecting the socket of user " + this.state.Username + " from the WebSocket server.");
			this.state.socket.close();
		}
	}
	
	componentDidMount = () => {
		this.socketHandler();
		window.addEventListener('beforeunload', this.disconnectHandler);
		
		
	}
	
	componentWillUnmount = () => {
		window.removeEventListener('beforeunload', this.disconnectHandler);
	}

	// componentWillUnmount = () =>{
	// 	this.disconnectHandler()
	// 	window.removeEventListener('unload', this.disconnectHandler)
	// }

	

	render() {
	  	// The userName will be get when the this.state.Username==""
		// pass the this.getUserName to the api_getUsername
		// console.log("print the username in the newGameTimerHandler: " + this.state.Username)
		// this.socketHandler();
		
		// console.log(this.state.timer)
		// console.log(typeof(this.state.timer))
		if(this.state.Username !== ''&&!this.state.KeyboardOn){
			api_newgame(this.state.Username, this.getNewGame)
		}

		console.log('this.state.timer === "00:01"' + this.state.timer == "00:01")
		console.log('this.state.timeoutHandled"' + this.state.timeoutHandled)
		if (this.state.timer == "00:01" && !this.state.timeoutHandled) {
			this.state.socket.send("pause")
			console.log("running the setTimeout")
			setTimeout(() => {
				
				// Check if the timer has reached 00:01 and the timeout has not been handled yet
					// Set timeoutHandled to true to prevent multiple executions
					this.setState({ timeoutHandled: true });
		
					// Check if the player lost the game due to timeout and lostTheRoll is false
					if(this.state.lostTheRoll){
						alert("You lost the game, the target is: "+ this.state.target)
					}
					if(this.state.winTheRoll){
						alert("You win the game, the target is: " + this.state.target)
					}
					else{

						console.log("username: "+ this.state.Username+ " "+ "lost")
						this.state.socket.send("lost")
						this.setState({lostTimes: this.state.lostTimes+1})
					}
	
					this.newGameTimerHandler();
				
			}, 15000);
		}
		
	  return (
	  <div>
		  <Header iconClickHandler={this.iconClickHandler} selectedButton={this.state.selectedComponent} />
		  {this.state.selectedComponent==='Home'&& <Home />}

		  {this.state.selectedComponent==='Username'&& <Username Username={this.state.Username} />}

		  {this.state.selectedComponent==='Play'&& <Play handleKeyPress={this.handleKeyPress} letterbox={this.state.letterbox} 
		  x={this.state.x} y={this.state.y} full={this.state.full} empty = {this.state.empty} handleKeyDelete={this.handleKeyDelete}
		  newGameTimerHandler = {this.newGameTimerHandler} KeyboardOn = {this.state.KeyboardOn} AllScoreMatrix = {this.state.AllScoreMatrix}
		  winHandler = {this.winHandler} keyboardColor={this.state.keyboardColor} keys={this.state.keys} timer = {this.state.timer}
		  total_win={this.state.total_win} total_lost={this.state.total_lost} join_number={this.state.join_number}
		  target={this.state.target}
		  />}
		  		  
		  {this.state.selectedComponent==='Stats'&& <Stats winTimes={this.state.winTimes} lostTimes={this.state.lostTimes}
		  />}

		  {this.state.selectedComponent==='Instruction'&& <Instruction />}

	  </div>
	  );
	}
  }
export { Main };
