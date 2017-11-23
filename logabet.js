var alphaNumString;
    var letterToType;
    var timer = null;
if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
} else {
    var synth = null;
}
    //var synth = window.speechSynthesis;
    var voiceTimeout = null;
    var letterTimeout = null;
    var blurTimeout = null;
    var caseSensitive = false;

    function speak(textToSpeak){

        if(synth !== null){
        	var msg = new SpeechSynthesisUtterance();

        	msg.text = textToSpeak.toString().replace("<br/>", " ");
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
                CSharp.speak(textToSpeak);
            }catch(e){}
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
                    default:
                }
            }
            else{
                switch(checkboxes[i].id){

                    case 'caseSens':
                        caseSensitive = false;
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