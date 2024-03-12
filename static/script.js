// script.js

document.addEventListener("DOMContentLoaded", function() {
    let isSpeaking = false; // Variable to track whether speech synthesis is in progress

    // Function to speak the text
    function speakText(text) {
        var utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        utterance.onend = function() {
            isSpeaking = false; // Update isSpeaking flag when speech synthesis ends
        };
    }

    // Function to handle Speak icon clicks
    function handleSpeakIconClick(event) {
        event.stopPropagation(); // Stop event propagation
        var text = event.target.parentElement.querySelector(".text-to-speak").innerText; // Get the text to speak
        if (!isSpeaking) {
            speakText(text);
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
        icon.addEventListener("click", handleSpeakIconClick);
    });
});
