document.addEventListener("DOMContentLoaded", function() {
    var storedBgColor = localStorage.getItem('bgColor');
    var storedFontSize = localStorage.getItem('fontSize');
    var storedVoice = localStorage.getItem('selectedVoice');
    

    if (storedBgColor) {
        document.body.style.backgroundColor = storedBgColor;
        document.getElementById('bgColor').value = storedBgColor; 
    }
    

    if (storedFontSize) {
        var fontSizeValue = parseInt(storedFontSize);
        document.body.style.fontSize = fontSizeValue + 'px';
        document.getElementById('fontSize').value = fontSizeValue; 
    }
    
    var voiceSelect = document.getElementById('voiceSelect');
    var voices = window.speechSynthesis.getVoices();
    voices.forEach(function(voice, index) {
        var option = document.createElement('option');
        option.textContent = voice.name + ' (' + voice.lang + ')';
        option.value = index;
        voiceSelect.appendChild(option);
    });
    
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
    

    document.body.style.backgroundColor = bgColor;
    document.body.style.fontSize = fontSize;


    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('selectedVoice', selectedVoiceIndex);
    
    closeSettingsPopup(); 
}




function updateBgColorInput(value) {
        document.getElementById('bgColor').value = value;
    }


    document.getElementById('bgColor').addEventListener('input', function(event) {
        document.body.style.backgroundColor = event.target.value; 
    });



    function setDefault() {

        document.getElementById('bgColor').value = '#f0f0f0'; 
    

        document.getElementById('fontSize').value = 16; 
    
        var defaultVoiceIndex = 0; 
        document.getElementById('voiceSelect').value = defaultVoiceIndex; 
    

        applySettings();
    }



    function showClickMode() {
        document.body.classList.add('click-mode');
        moveToSettingsIcon();
    }

    function moveToSettingsIcon() {
        var settingsIcon = document.querySelector('.settings-icon-container');
        var rect = settingsIcon.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;


        var event = new MouseEvent('mousemove', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'screenX': centerX,
            'screenY': centerY
        });
        document.dispatchEvent(event);
    }



    function openGuidePopup() {
        document.getElementById("guidePopup").style.display = "block";
    }
    

    function closeGuidePopup() {
        document.getElementById("guidePopup").style.display = "none";
    }