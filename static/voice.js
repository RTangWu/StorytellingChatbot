document.addEventListener("DOMContentLoaded", function() {
    let isSpeaking = false; // Variable to track whether speech synthesis is in progress

    // Function to speak the text
    function speakText(text, selectedVoice) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice; // Set the selected voice
        window.speechSynthesis.speak(utterance);
        utterance.onend = function() {
            isSpeaking = false; // Update isSpeaking flag when speech synthesis ends
        };
    }

    // Function to handle Speak icon clicks
    function handleSpeakIconClick(event, selectedVoice) {
        event.stopPropagation(); // Stop event propagation
        var text = event.target.parentElement.querySelector(".text-to-speak").innerText; // Get the text to speak
        if (!isSpeaking) {
            speakText(text, selectedVoice);
            isSpeaking = true; // Update isSpeaking flag when speech synthesis starts
            event.target.classList.add('animate__animated', 'animate__pulse'); // Add animation class
        } else {
            window.speechSynthesis.cancel(); // Stop speech synthesis if already speaking
            isSpeaking = false; // Update isSpeaking flag
            event.target.classList.remove('animate__animated', 'animate__pulse'); // Remove animation class
        }
    }

    // Add event listener for Speak icons initially
    var speakIcons = document.querySelectorAll(".speak-icon");
    speakIcons.forEach(function(icon) {
        icon.addEventListener("click", function(event) {
            var selectedVoiceIndex = document.getElementById('voiceSelect').value;
            var selectedVoice = window.speechSynthesis.getVoices()[selectedVoiceIndex];
            handleSpeakIconClick(event, selectedVoice);
        });
    });
    
    // Listen for the 'voiceschanged' event to ensure voices are loaded
    window.speechSynthesis.onvoiceschanged = function() {
        // Populate voice selection dropdown with available voices
        var voiceSelect = document.getElementById('voiceSelect');
        var voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = ''; // Clear previous options
        voices.forEach(function(voice, index) {
            var option = document.createElement('option');
            option.textContent = voice.name + ' (' + voice.lang + ')';
            option.value = index;
            voiceSelect.appendChild(option);
        });

        // Set the selected voice if it's stored in local storage
        var storedVoice = localStorage.getItem('selectedVoice');
        if (storedVoice) {
            voiceSelect.value = storedVoice;
        }
    };
});




