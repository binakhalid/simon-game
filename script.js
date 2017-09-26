(function() {

 
var isOn = false;
var isPlaying = false;
var isStrict = false;

var displayValue = '&nbsp';

var sequence = '';
var userSequence= '';
var userOnTurn = false;
  
var turn = 0;
var tonesPlayed = 0;

var interval = 1500;

var tones = [
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'), 
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'), 
  new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')];       

  
var toggleOnOff = function() {
  if (isOn) {
     $('#start-button').unbind('click');
     $('#strict-button').unbind('click');
     displayValue = '&nbsp;';
     $('#slider').css('float','');
     if (isStrict) { 
       toggleStrict(); 
     }
  }
  else {
     $('#start-button').on('click', toggleStartStop);
     $('#strict-button').on('click', toggleStrict);
     $('#slider').css('float','right');
     displayValue = '--';
  }
  isOn = !isOn;
  showScore();
}
 
var toggleStartStop = function() {
  if (isPlaying) {
    disablePads();
    displayValue = '--';
  } 
  else {
    displayValue = '01';
    createSequence();
    turn = 1;
    tonesPlayed = 0;
    interval = 1500;
    userOnTurn = false;
    disablePads();
    setTimeout(playSequence,2000);
  }
  showScore();
  isPlaying = !isPlaying;
}

// Strict button handler  
var toggleStrict = function() {
   isStrict = !isStrict;
   $('#strict-led').toggleClass('light-on');
}

// Handler for a pressed color pad. 
// Also used to show the right sequences by the computer
var padPressed = function(id) {
  $('#pad'+id).addClass('pressed');
  tones[id-1].play();
  if (userOnTurn) {
    userSequence +=''+id;
    var err = validateInput();
    if (!err) {
      if (userSequence.length === turn) {
        turn++;
        if (turn <= 20) {
          displayValue= (turn<10?'0'+turn:turn);
          showScore();
          userOnTurn = false;
          setTimeout(disablePads,interval+(interval/3));
          tonesPlayed=0;
          setTimeout(playSequence,3000);
        }
        else {
          // User has reached the 20 !!! Make some noise and start over
           setTimeout(reportError, 300);
           setTimeout(reportError, 600);
           setTimeout(reportError, 900);
           setTimeout(reportError, 1200);
           setTimeout(reportError, 1500);
           setTimeout(reportError, 1800);
           setTimeout(reportError, 2100);
           isPlaying = false;
           setTimeout(toggleStartStop, 2400);
        }
      }
    }
    else {
       if (!isStrict) {
         tonesPlayed=0;
         setTimeout(playSequence,1000);
       }
    }
  }
}

// Reset the highlight on a color pad
var padReleased = function(id) {
  $('#pad'+id).removeClass('pressed');
}

// Validate the user's input sequence against the computer's
var validateInput = function() {
  if (sequence.substring(0, userSequence.length) != userSequence) {
    userOnTurn=false;
    reportError();
    userSequence = '';
    if (isStrict) {
      isPlaying = false;
      toggleStartStop();
    }
    return true;
  }
  return false;
}


var enablePads = function() {
    $('#pad1').on('mousedown', function() {padPressed(1);});
    $('#pad2').on('mousedown', function() {padPressed(2);});
    $('#pad3').on('mousedown', function() {padPressed(3);});
    $('#pad4').on('mousedown', function() {padPressed(4);});
    $('#pad1').on('mouseup', function() {padReleased(1);});
    $('#pad2').on('mouseup', function() {padReleased(2);});
    $('#pad3').on('mouseup', function() {padReleased(3);});
    $('#pad4').on('mouseup', function() {padReleased(4);});
}

var disablePads = function() {
    $('#pad1').unbind('mousedown');
    $('#pad2').unbind('mousedown');
    $('#pad3').unbind('mousedown');
    $('#pad4').unbind('mousedown');
    $('#pad1').unbind('mouseup');
    $('#pad2').unbind('mouseup');
    $('#pad3').unbind('mouseup');
    $('#pad4').unbind('mouseup');
}


var reportError = function() {
  disablePads();
  padPressed(1);
  setTimeout(padReleased, 200, 1);
  padPressed(2);
  setTimeout(padReleased, 200, 2);
  padPressed(3);
  setTimeout(padReleased, 200, 3);
  padPressed(4);
  setTimeout(padReleased, 200, 4);
}


var showScore = function() {
  $('#display').html(displayValue);
}
  
// Generate a new sequence for a new game 
var createSequence = function() {
  sequence = '';
  for (var i=0 ; i< 20; i++) {
    sequence += Math.floor(Math.random()*4)+1;
  }
}


var playSequence = function() {
  if (!isPlaying) return;
  if (turn === 5) interval = 1200;
  if (turn === 9) interval = 800;
  if (turn === 13) interval = 500;
  
  if (tonesPlayed < turn) {
    var padid = parseInt(sequence.substring(tonesPlayed, tonesPlayed+1));
    padPressed(padid);
    setTimeout(padReleased, interval, padid);
    tonesPlayed++;
    setTimeout(playSequence, interval+(interval/3));
  }
  else {
    userOnTurn = true;
    userSequence = '';
    enablePads();
  }
}


$(document).ready(function() {
   $('#onoff').click(toggleOnOff);
});


})();