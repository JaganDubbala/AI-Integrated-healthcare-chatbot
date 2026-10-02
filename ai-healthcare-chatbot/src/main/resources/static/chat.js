const $ = id => document.getElementById(id);

const chatBox = $("chatBox");
const input = $("messageInput");
const sendButton = $("sendButton");
const micButton = $("micButton");
const voiceStatus = $("voiceStatus");

let pendingSymptom = null;

let recognition = null;
let isListening = false;
let liveUserMessage = null;


// =====================================================
// ADD MESSAGE
// =====================================================

function addMessage(text, sender) {

    const wrapper = document.createElement("div");

    wrapper.className = `message ${sender}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    chatBox.appendChild(wrapper);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// =====================================================
// CREATE LIVE VOICE MESSAGE
// =====================================================

function createLiveVoiceMessage() {

    // Remove old live message
    if (liveUserMessage) {
        liveUserMessage.remove();
    }

    const wrapper = document.createElement("div");

    wrapper.className = "message user";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = "🎤 Listening...";

    wrapper.appendChild(bubble);

    chatBox.appendChild(wrapper);

    liveUserMessage = wrapper;

    chatBox.scrollTop = chatBox.scrollHeight;
}


// =====================================================
// UPDATE LIVE SPOKEN TEXT
// =====================================================

function updateLiveVoiceMessage(text) {

    if (!liveUserMessage) {
        createLiveVoiceMessage();
    }

    const bubble =
        liveUserMessage.querySelector(".bubble");

    bubble.textContent =
        text || "🎤 Listening...";

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// REMOVE LIVE MESSAGE
// =====================================================

function removeLiveVoiceMessage() {

    if (liveUserMessage) {

        liveUserMessage.remove();

        liveUserMessage = null;
    }
}


// =====================================================
// TEXT TO SPEECH
// =====================================================

function speak(text) {

    if (!window.speechSynthesis) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 0.95;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// =====================================================
// STOP BOT SPEAKING
// =====================================================

function stopSpeaking() {

    if (window.speechSynthesis) {

        window.speechSynthesis.cancel();
    }
}


// =====================================================
// SHOW SEVERITY BUTTONS
// =====================================================

function addSeverityButtons(symptom) {

    pendingSymptom = symptom;

    const wrapper =
        document.createElement("div");

    wrapper.className = "message bot";

    const bubble =
        document.createElement("div");

    bubble.className = "bubble";


    const title =
        document.createElement("strong");

    title.textContent =
        "Please select the severity:";

    bubble.appendChild(title);


    // Minor button
    const minorButton =
        document.createElement("button");

    minorButton.className =
        "severity-button";

    minorButton.textContent =
        "Minor / Mild";

    minorButton.onclick = function () {

        processSeverity(
            symptom,
            "MINOR"
        );
    };


    // Major button
    const majorButton =
        document.createElement("button");

    majorButton.className =
        "severity-button";

    majorButton.textContent =
        "Major / Severe";

    majorButton.onclick = function () {

        processSeverity(
            symptom,
            "MAJOR"
        );
    };


    bubble.appendChild(minorButton);

    bubble.appendChild(majorButton);

    wrapper.appendChild(bubble);

    chatBox.appendChild(wrapper);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// SEND NORMAL MESSAGE
// =====================================================

async function sendMessage() {

    const message =
        input.value.trim();


    if (!message) {

        voiceStatus.textContent =
            "Please enter a question.";

        return;
    }


    // Stop speech before sending
    stopSpeaking();


    // =================================================
    // CHECK TYPED SEVERITY
    // =================================================

    const typedSeverity =
        message.toLowerCase();


    if (
        pendingSymptom &&
        (
            typedSeverity === "mild" ||
            typedSeverity === "minor" ||
            typedSeverity === "major" ||
            typedSeverity === "severe"
        )
    ) {

        addMessage(
            message,
            "user"
        );

        input.value = "";

        await processSeverity(
            pendingSymptom,
            typedSeverity === "mild" ||
            typedSeverity === "minor"
                ? "MINOR"
                : "MAJOR"
        );

        return;
    }


    // =================================================
    // NORMAL MESSAGE
    // =================================================

    addMessage(
        message,
        "user"
    );

    input.value = "";

    sendButton.disabled = true;

    voiceStatus.textContent =
        "Thinking...";


    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Server error"
            );
        }


        addMessage(
            data.response,
            "bot"
        );


        speak(
            data.response
        );


        // Severity required
        if (
            data.intent ===
                "SEVERITY_REQUIRED" &&
            data.severityRequired &&
            data.symptom
        ) {

            addSeverityButtons(
                data.symptom
            );
        }


        // Appointment
        if (
            data.intent ===
                "APPOINTMENT"
        ) {

            setTimeout(
                function () {

                    window.location.href =
                        "appointments.html";

                },
                800
            );
        }


        voiceStatus.textContent =
            `Intent detected: ${data.intent}`;

    }
    catch (error) {

        addMessage(
            "Sorry, I could not connect to the server. Please try again.",
            "bot"
        );

        voiceStatus.textContent =
            error.message;

    }
    finally {

        sendButton.disabled =
            false;

        input.focus();
    }
}


// =====================================================
// PROCESS MINOR / MAJOR
// =====================================================

async function processSeverity(
    symptom,
    severity
) {

    // Stop bot speech
    stopSpeaking();


    // Disable severity buttons
    document
        .querySelectorAll(
            ".severity-button"
        )
        .forEach(
            button => {

                button.disabled = true;

            }
        );


    const displaySeverity =
        severity === "MINOR"
            ? "Minor / Mild"
            : "Major / Severe";


    addMessage(
        displaySeverity,
        "user"
    );


    voiceStatus.textContent =
        "Checking symptom severity...";


    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: symptom,
                        severity: severity
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Server error"
            );
        }


        addMessage(
            data.response,
            "bot"
        );


        speak(
            data.response
        );


        voiceStatus.textContent =
            `Intent detected: ${data.intent}`;


        pendingSymptom = null;

    }
    catch (error) {

        addMessage(
            "Unable to process severity. Please try again.",
            "bot"
        );

        voiceStatus.textContent =
            error.message;
    }
}


// =====================================================
// SEND BUTTON
// =====================================================

sendButton.onclick =
    sendMessage;


// =====================================================
// ENTER KEY
// =====================================================

input.onkeydown =
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    };


// =====================================================
// CLEAR CHAT
// =====================================================

const clearButton =
    $("clearButton");


if (clearButton) {

    clearButton.onclick =
        function () {

            stopSpeaking();

            // Stop microphone
            if (recognition && isListening) {

                recognition.stop();
            }

            pendingSymptom = null;

            removeLiveVoiceMessage();

            chatBox.innerHTML = "";

            addMessage(
                "Chat cleared. How can I help you?",
                "bot"
            );

            voiceStatus.textContent = "";

            input.focus();
        };
}


// =====================================================
// STOP SPEAKING BUTTON
// =====================================================

const stopSpeechButton =
    $("stopSpeechButton");


if (stopSpeechButton) {

    stopSpeechButton.onclick =
        function () {

            stopSpeaking();

            voiceStatus.textContent =
                "Speaking stopped.";

        };
}


// =====================================================
// SPEECH RECOGNITION
// =====================================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-US";


    // IMPORTANT:
    // Gives live/interim words while speaking
    recognition.interimResults =
        true;


    recognition.continuous =
        false;


    // =================================================
    // MICROPHONE BUTTON
    // =================================================

    micButton.onclick =
        function () {

            // -----------------------------------------
            // If already listening → STOP
            // -----------------------------------------

            if (isListening) {

                recognition.stop();

                return;
            }


            // -----------------------------------------
            // STOP BOT SPEECH FIRST
            // -----------------------------------------

            stopSpeaking();


            // -----------------------------------------
            // Start microphone
            // -----------------------------------------

            try {

                recognition.start();

            }
            catch (error) {

                console.log(
                    "Recognition already started."
                );

            }
        };


    // =================================================
    // START LISTENING
    // =================================================

    recognition.onstart =
        function () {

            isListening = true;

            micButton.textContent =
                "⏹️";

            micButton.title =
                "Stop listening";


            voiceStatus.textContent =
                "🎤 Listening...";


            // Show live message
            createLiveVoiceMessage();
        };


    // =================================================
    // LIVE SPEECH RESULT
    // =================================================

    recognition.onresult =
        function (event) {

            let finalText = "";

            let interimText = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const transcript =
                    event.results[i][0]
                        .transcript;


                if (
                    event.results[i].isFinal
                ) {

                    finalText +=
                        transcript;

                }
                else {

                    interimText +=
                        transcript;
                }
            }


            // -----------------------------------------
            // SHOW WORDS WHILE USER IS SPEAKING
            // -----------------------------------------

            const displayText =
                finalText + interimText;


            updateLiveVoiceMessage(
                "🎤 " + displayText
            );


            voiceStatus.textContent =
                "🎤 " + displayText;


            // -----------------------------------------
            // FINAL SPEECH
            // -----------------------------------------

            if (finalText.trim()) {

                const finalMessage =
                    finalText.trim();


                // Remove temporary live message
                removeLiveVoiceMessage();


                // Put final text in input
                input.value =
                    finalMessage;


                voiceStatus.textContent =
                    "Voice message received.";


                // Automatically send
                setTimeout(
                    function () {

                        sendMessage();

                    },
                    300
                );
            }
        };


    // =================================================
    // END LISTENING
    // =================================================

    recognition.onend =
        function () {

            isListening = false;

            micButton.textContent =
                "🎤";

            micButton.title =
                "Start voice input";


            // If no final message was received
            if (!input.value.trim()) {

                voiceStatus.textContent =
                    "Voice listening stopped.";
            }
        };


    // =================================================
    // SPEECH ERROR
    // =================================================

    recognition.onerror =
        function (event) {

            isListening = false;

            micButton.textContent =
                "🎤";

            micButton.title =
                "Start voice input";


            removeLiveVoiceMessage();


            if (
                event.error ===
                "not-allowed"
            ) {

                voiceStatus.textContent =
                    "Microphone permission was denied. Please allow microphone access in your browser.";

            }
            else if (
                event.error ===
                "no-speech"
            ) {

                voiceStatus.textContent =
                    "No speech detected. Please try again.";

            }
            else {

                voiceStatus.textContent =
                    "Voice input error: " +
                    event.error;
            }
        };

}
else {

    micButton.disabled =
        true;

    voiceStatus.textContent =
        "Speech recognition is not supported in this browser.";
}