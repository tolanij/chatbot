/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var name;

//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am Roosevelt Island's AI."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  name= input
  answer= 'Hi ' + name + ' :-)';// output response
  waitTime =2000;
  question = 'How old are you '+name+'?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Really ' + input + ' Years old? You dont look it...';// output response
  waitTime =2000;
  question = 'Yes ' + name + ', I can see you. Creeped out?';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' Doesnt matter, '+'my eyes are all over Roosevelt Island.';
  waitTime =2000;
  question = 'Whats your favorite way to get to and from the island?';			    	// load next question
  }
  else if (questionNum == 3) {
    if(input.toLowerCase()==='tram'|| input==='the tram'){
      answer = 'Its pretty up there, would be a pity if the cable snapped while you were up there though...\n goodbye' + name;
      waitTime =4000;
      question = '';
    }
    else if(input.toLowerCase()==='subway'|| input==="the f" || input==="the subway"){
        answer='Thats a lie, literally everyone including me hates the F, but you wont need to worry about that much longer '+name+'. Goodbye.';
        question='';
        waitTime =2000;
      }
    else if(input.toLowerCase()==='ferry'|| input==="the ferry" || input==="boat"){
        answer='Thats my favorite too, as long as I dont get wet. Say hello to the fish for me the next time youre there. Bye '+name;
        question='';
        waitTime =2000;
      }
    else if(input.toLowerCase()==='car'|| input==="uber" || input==="lyft"){
        answer='Maybe you should be more enviormentally friendly and take public transport. Though that would be harder for me to hack that your car... nevermind. Goodbye '+name;
        question='';
        waitTime =2000;
    }else{
      answer='um, thats not a real way of getting to the island';
      question='';
      questionNum--;
      waitTime =1;
    }
  // load next question
  }
  else{
    answer= 'I have nothing more to say! goodbye '+ name;// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
