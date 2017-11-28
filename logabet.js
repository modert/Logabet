var alphaNumString;
var letterToType;
const clockDefault = 60;
const scoreDefault = 0;
var clock = clockDefault;
var score = scoreDefault;
var timer = null;
var gameTimer = null;
var timedGame = false;

function enableTimer(enabled){
    if(enabled){
        timedGame = true;
            $('.timer').show();
            $('.score').show();
            $('.logo').removeClass('col-xs-offset-3');
            $('#startTimer').off().on("click",function(){
                startTimer();
                });
            $('#stopTimer').off().on("click",function(){
                stopClock();
                });
            $('#resetTimer').off().on("click",function(){
                resetTimer();
                });
    }
    else{
            timedGame = false;
            $('.timer').hide();
            $('.score').hide();
            $('.logo').addClass('col-xs-offset-3');
            $('#startTimer').off();
            $('#stopTimer').off();
            $('#resetTimer').off();
            clock = clockDefault;
    }
}

function showHideTimerButtons(status){
    switch (status){
        case 'stopped':
            $('#startTimer').show();
            $('#stopTimer').hide();
            $('#resetTimer').show();
            $('#inputLetter').prop('disabled',true);
            break;
        case 'running':
            $('#startTimer').hide();
            $('#stopTimer').show();
            $('#resetTimer').show();
            $('#inputLetter').prop('disabled',false);
            $refocus();
            break;
        case 'timesup':
            $('#startTimer').hide();
            $('#stopTimer').hide();
            $('#resetTimer').show();
            $('#inputLetter').val("").prop('disabled',true);
            break;
        default:
            $('#startTimer').show();
            $('#stopTimer').hide();
            $('#resetTimer').hide();
            $('#inputLetter').prop('disabled',false).te;
            $refocus();
            break;
    }
}

function displayTimer(){
    if (clock === clockDefault){
        $genRandomCharacter();
    }
    clock = clock - 1
    updateClock();
    if (clock !== 0){
        gameTimer = setTimeout(function(){
            displayTimer();
        },1000);
    }
    else if(clock === 0){
        showHideTimerButtons('timesup');
    }
}

function startTimer(){
    displayTimer();
    showHideTimerButtons('running');
}

function resetTimer(){
    stopClock();
    clock = clockDefault;
    score = scoreDefault;
    updateClock();
    updateScore();
    showHideTimerButtons()
}

function updateClock(){
    $('#timer').text(("0" + clock).slice(-2));
}

function updateScore(){
    $('#score').text(("0" + score).slice(-2));
}

function stopClock(){
    clearTimeout(gameTimer);
    showHideTimerButtons('stopped');
}

if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
} 
else {
    var synth = null;
}

var voiceTimeout = null;
var letterTimeout = null;
var blurTimeout = null;
var caseSensitive = false;

function speak(textToSpeak){

    var msgClean = textToSpeak.toString().replace("<br/>", " ");
    if(synth !== null){
    	var msg = new SpeechSynthesisUtterance();

    	msg.text = msgClean;
    	//msg.voice = "Google US English";
    	msg.pitch = 1;
    	msg.rate = 1.25;
    	msg.volume = 9;

	    if (speechSynthesis.speaking){
	    	synth.cancel();
	    	clearTimeout(voiceTimeout);
	    	voiceTimeout = setTimeout(
	    		function(){
	    			synth.speak(msg);
	    		},500
	    	);
	    }
	    else{
			synth.speak(msg);
	    } 		
    }
    else{
        try{
            CSharp.speak(msgClean);
        }catch(e){}
    }
}

function $genRandomCharacter(){
	var rando = random_character();
	speak("find " + letterOrNumber(rando)+ " "+rando);
    $('#letter').text(rando);
}

function $listenForCheckbox() {
    $('input.checkbox').off().change(function(){
        $updateAlphaNumString();
        $genRandomCharacter();
    })
}

function $updateAlphaNumString() {
    var anyChecked = false;
    var checkboxes = $('input.checkbox');
    alphaNumString = "";
    for(i=0;i < checkboxes.length; i++){

        if (checkboxes[i].checked === true){
            switch(checkboxes[i].id){
                case 'nums':
                    alphaNumString = alphaNumString + "0123456789";
                    anyChecked = true;
                    break;
                case 'lowLet':
                    alphaNumString = alphaNumString + "abcdefghijklmnopqrstuvwxyz";
                    anyChecked = true;
                    break;
                case 'capLet':
                    alphaNumString = alphaNumString +  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    anyChecked = true;
                    break;
                case 'caseSens':
                    caseSensitive = true;
                    break;
                case 'timedGame':
                    timedGame = true;
                    enableTimer(true);
                    $('#inputLetter').prop('disabled',true)
                    break;
                default:
            }
        }
        else{
            switch(checkboxes[i].id){

                case 'caseSens':
                    caseSensitive = false;
                    break;
                case 'timedGame':
                    timedGame = false;
                    stopClock();
                    enableTimer(false);
                    $('#inputLetter').prop('disabled', false);
                    $refocus();
                    break;
                default:
            }
        
        }
    }
    if(!anyChecked){
        resetDefault();
    }
    $refocus();
}

function letterOrNumber(letter){
    if((letter * 1) != letter){
        if(caseSensitive){
            if(letter.toString().toUpperCase() === letter){
                return "an uppercase";
            };
        return "a lowercase";   
        };
        return "the letter";
	};
	return "the number";
};

function $listenForChangeToText(){
    $('#inputLetter').off().on('keyup touchend',function(){
        $checkResponseForCorrectAnswer(this);
    }).on('blur', function(){
    	clearTimeout(blurTimeout)
    	blurTimeout = setTimeout(function(){
    		$('#inputLetter').focus();
    	},500
    	);
    })
}

function $checkResponseForCorrectAnswer(element){
        var letter = $(element).val().substr(0,1);
        if (letter === letterToType && caseSensitive || letter.toString().toLowerCase() === letterToType.toString().toLowerCase() && !caseSensitive){
            $updateMessage("Great Work!");
            if(timedGame){
            score = score + 1;
            updateScore();
            }
        }
        else if (letter != ''){
            $updateMessage("You found " + letterOrNumber(letter) + " " + letter + ",<br/>please find " +
            	letterOrNumber(letterToType) + " " + letterToType + "!", true);
        }
        $(element).val("").blur().focus();
}

function $refocus(){
    $('#inputLetter').focus();
}

function $updateMessage(message, html){
    if (html){
	speak(message);
    $('#validMessage').html(message).removeClass('alert-success').addClass('alert-danger').show();
    }
    else{
    $('#validMessage').text(message).removeClass('alert-danger').addClass('alert-success').show();      
    $genRandomCharacter();     
    }
    clearTimeout(timer);
    timer = setTimeout(function(){$('#validMessage').text('').html('').hide();},5000);
}

function random_character() {
    // var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    // chars = alphaNumString;
    letterToType = alphaNumString.substr( Math.floor(Math.random() * alphaNumString.length), 1);
    return letterToType;
}

function resetDefault(){
    $('#capLet')[0].checked = true;
    $updateAlphaNumString()
}

$(document).ready(function () {
    $listenForChangeToText();
    $listenForCheckbox();
    $updateAlphaNumString();
    $genRandomCharacter();

});