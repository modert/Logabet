var alphaNumString;
    var letterToType;
    var timer = null;
    var synth = window.speechSynthesis;
    var voiceTimeout = null;
    var letterTimeout = null;
    var blurTimeout = null;

    function speak(textToSpeak){

    	var msg = new SpeechSynthesisUtterance();

    	msg.text = textToSpeak;
    	//msg.voice = "Google US English";
    	msg.pitch = 4;
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

    $(document).ready(function () {
        $listenForChangeToText();
        $listenForCheckbox();
        $updateAlphaNumString();
        $genRandomCharacter();
    });

    function $genRandomCharacter(){
    	var rando = random_character();
		speak(rando);
        $('#letter').text(rando);
    }

    function $listenForCheckbox() {
        $('input.checkbox').off().change(function(){
            $updateAlphaNumString();
            $genRandomCharacter();
        })
    }

    function $updateAlphaNumString() {
        var checkboxes = $('input.checkbox');
        alphaNumString = "";
        for(i=0;i < checkboxes.length; i++){

            if (checkboxes[i].checked === true){
                switch(checkboxes[i].id){
                    case 'nums':
                        alphaNumString = alphaNumString + "0123456789";
                    break;
                    case 'lowLet':
                        alphaNumString = alphaNumString + "abcdefghijklmnopqrstuvwxyz";
                    break;
                    case 'capLet':
                        alphaNumString = alphaNumString +  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    break;
                    default:
                }
            }
        }
        $refocus();
    }

    function letterOrNumber(letter){
        if((letter * 1) !== letter){
    		return "letter";
    	};
		return "number";
    }

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
            if (letter === letterToType && $('#caseSens')[0].checked || letter.toString().toLowerCase() === letterToType.toString().toLowerCase() && !$('#caseSens')[0].checked){
                $updateMessage("Great Work!");
            }
            else if (letter != ''){
                $updateMessage("You found the " + letterOrNumber(letter) + " " + letter + ".<br/>Please find the " +
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