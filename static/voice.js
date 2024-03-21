document.addEventListener("DOMContentLoaded", function() {
    let isSpeaking = false; 

   
    function speakText(text, selectedVoice) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice; 
        window.speechSynthesis.speak(utterance);
        utterance.onend = function() {
            isSpeaking = false; 
        };
    }


    function handleSpeakIconClick(event, selectedVoice) {
        event.stopPropagation(); 
        var text = event.target.parentElement.querySelector(".text-to-speak").innerText; 
        if (!isSpeaking) {
            speakText(text, selectedVoice);
            isSpeaking = true; 
            event.target.classList.add('animate__animated', 'animate__pulse'); 
        } else {
            window.speechSynthesis.cancel(); 
            isSpeaking = false; 
            event.target.classList.remove('animate__animated', 'animate__pulse');
        }
    }


    var speakIcons = document.querySelectorAll(".speak-icon");
    speakIcons.forEach(function(icon) {
        icon.addEventListener("click", function(event) {
            var selectedVoiceIndex = document.getElementById('voiceSelect').value;
            var selectedVoice = window.speechSynthesis.getVoices()[selectedVoiceIndex];
            handleSpeakIconClick(event, selectedVoice);
        });
    });
    

    window.speechSynthesis.onvoiceschanged = function() {

        var voiceSelect = document.getElementById('voiceSelect');
        var voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = ''; 
        voices.forEach(function(voice, index) {
            var option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            option.value = index;
            voiceSelect.appendChild(option);
        });


        var storedVoice = localStorage.getItem('selectedVoice');
        if (storedVoice) {
            voiceSelect.value = storedVoice;
        }
    };
});