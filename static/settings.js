// customize colour, the font size and voice

document.addEventListener("DOMContentLoaded", function() {
    var storedBgColor = localStorage.getItem('bgColor');
    var storedFontSize = localStorage.getItem('fontSize');
    var storedVoice = localStorage.getItem('selectedVoice');
    
    // Set the background color based on the stored value
    if (storedBgColor) {
        document.body.style.backgroundColor = storedBgColor;
        document.getElementById('bgColor').value = storedBgColor; // Set the value of bgColor input field
    }
    
    // Set the font size based on the stored value
    if (storedFontSize) {
        var fontSizeValue = parseInt(storedFontSize);
        document.body.style.fontSize = fontSizeValue + 'px'; // Set the font size of the body
        document.getElementById('fontSize').value = fontSizeValue; // Set the value of fontSize input field
    }
    
    // Populate voice selection dropdown with available voices
    var voiceSelect = document.getElementById('voiceSelect');
    var voices = window.speechSynthesis.getVoices();
    voices.forEach(function(voice, index) {
        var option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';
        option.value = index;
        voiceSelect.appendChild(option);
    });
    
    // Set the selected voice if it's stored in local storage
    if (storedVoice) {
        voiceSelect.value = storedVoice;
    }
});

function openSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'block';
}

function closeSettingsPopup() {
    document.getElementById('settingsPopup').style.display = 'none';
}

function applySettings() {
    var bgColor = document.getElementById('bgColor').value;
    var fontSize = document.getElementById('fontSize').value + 'px';
    var selectedVoiceIndex = document.getElementById('voiceSelect').value;
    var selectedVoice = window.speechSynthesis.getVoices()[selectedVoiceIndex];
    
    // Apply background color and font size
    document.body.style.backgroundColor = bgColor;
    document.body.style.fontSize = fontSize;

    // Store selected background color, font size, and voice in local storage
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('selectedVoice', selectedVoiceIndex);
    
    closeSettingsPopup(); // Close the popup after applying settings
}




function updateBgColorInput(value) {
        document.getElementById('bgColor').value = value;
    }

    // Event listener for background color input
    document.getElementById('bgColor').addEventListener('input', function(event) {
        document.body.style.backgroundColor = event.target.value; // Update background color of settings popup
    });



    function setDefault() {
        // Set default background color
        document.getElementById('bgColor').value = '#f0f0f0'; // Default white color
    
        // Set default font size
        document.getElementById('fontSize').value = 16; // Default font size
    
        // Set default voice
        var defaultVoiceIndex = 0; // Index of the default voice (change this according to your preference)
        document.getElementById('voiceSelect').value = defaultVoiceIndex; // Set the default voice in the dropdown
    
        // Apply default settings
        applySettings();
    }
