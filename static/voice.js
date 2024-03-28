// When the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Variable to track if text is currently being spoken
    let isSpeaking = false; 

    // Function to speak the provided text using the selected voice
    function speakText(text, selectedVoice) {
        // Create a SpeechSynthesisUtterance object with the provided text
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice; 
        window.speechSynthesis.speak(utterance);
        utterance.onend = function() {
            isSpeaking = false; 
        };
    }

    // Handle click event on the speak icon
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

    // Get all speak icons and attach click event listener to each
    var speakIcons = document.querySelectorAll(".speak-icon");
    speakIcons.forEach(function(icon) {
        icon.addEventListener("click", function(event) {
            var selectedVoiceIndex = document.getElementById('voiceSelect').value;
            var selectedVoice = window.speechSynthesis.getVoices()[selectedVoiceIndex];
            handleSpeakIconClick(event, selectedVoice);
        });
    });

    // When available voices change
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
