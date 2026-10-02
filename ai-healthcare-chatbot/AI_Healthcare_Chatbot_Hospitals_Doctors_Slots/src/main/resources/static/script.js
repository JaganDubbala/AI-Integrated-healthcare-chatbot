const chatBox = document.getElementById("chatBox");

const input = document.getElementById("messageInput");

const sendButton = document.getElementById("sendButton");

const micButton = document.getElementById("micButton");

const clearButton = document.getElementById("clearButton");

const stopSpeechButton = document.getElementById("stopSpeechButton");

const voiceStatus = document.getElementById("voiceStatus");


// =====================================================
// CHAT MESSAGE
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
// SEVERITY BUTTONS
// =====================================================

function addSeverityButtons(symptom) {

    const wrapper = document.createElement("div");

    wrapper.className = "message bot";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    const title = document.createElement("div");

    title.textContent = "Please select the severity:";

    title.style.marginBottom = "10px";

    bubble.appendChild(title);


    // Minor button
    const minorButton = document.createElement("button");

    minorButton.textContent = "Minor / Mild";

    minorButton.className = "severity-button";

    minorButton.style.marginRight = "8px";

    minorButton.addEventListener("click", function () {

        processSeverity(symptom, "MINOR");

    });


    // Major button
    const majorButton = document.createElement("button");

    majorButton.textContent = "Major / Severe";

    majorButton.className = "severity-button";


    majorButton.addEventListener("click", function () {

        processSeverity(symptom, "MAJOR");

    });


    bubble.appendChild(minorButton);

    bubble.appendChild(majorButton);

    wrapper.appendChild(bubble);

    chatBox.appendChild(wrapper);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// =====================================================
// PROCESS MINOR / MAJOR SEVERITY
// =====================================================

async function processSeverity(symptom, severity) {

    // Disable all severity buttons after selection
    const buttons = document.querySelectorAll(".severity-button");

    buttons.forEach(button => {

        button.disabled = true;

    });


    // Show user's selection
    const displaySeverity =
        severity === "MINOR"
            ? "Minor / Mild"
            : "Major / Severe";

    addMessage(
        `${symptom} - ${displaySeverity}`,
        "user"
    );

    voiceStatus.textContent = "Checking severity...";


    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: symptom,
                severity: severity
            })

        });


        if (!response.ok) {

            const error =
                await response.json().catch(() => ({}));

            throw new Error(
                error.message || "Server error"
            );
        }


        const data = await response.json();


        addMessage(data.response, "bot");

        speak(data.response);


        voiceStatus.textContent =
            `Intent detected: ${data.intent}`;


    } catch (error) {

        addMessage(
            "Sorry, I could not connect to the server. Please try again.",
            "bot"
        );

        voiceStatus.textContent = error.message;

    }

}


// =====================================================
// SEND NORMAL MESSAGE
// =====================================================

async function sendMessage() {

    const message = input.value.trim();


    if (!message) {

        voiceStatus.textContent =
            "Please enter a question.";

        return;
    }


    if (message.length > 500) {

        voiceStatus.textContent =
            "Message is too long.";

        return;
    }


    addMessage(message, "user");

    input.value = "";

    sendButton.disabled = true;

    voiceStatus.textContent = "Thinking...";


    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        if (!response.ok) {

            const error =
                await response.json().catch(() => ({}));

            throw new Error(
                error.message || "Server error"
            );
        }


        const data = await response.json();


        // Display chatbot response
        addMessage(data.response, "bot");

        speak(data.response);


        // =============================================
        // SEVERITY REQUIRED
        // =============================================

        if (
            data.intent === "SEVERITY_REQUIRED" &&
            data.severityRequired === true &&
            data.symptom
        ) {

            addSeverityButtons(data.symptom);
        }


        // =============================================
        // APPOINTMENT
        // =============================================

        if (data.intent === "APPOINTMENT") {

            openAppointmentForm();

        }


        voiceStatus.textContent =
            `Intent detected: ${data.intent}`;


    } catch (error) {

        addMessage(
            "Sorry, I could not connect to the server. Please try again.",
            "bot"
        );

        voiceStatus.textContent =
            error.message;


    } finally {

        sendButton.disabled = false;

        input.focus();

    }

}


// =====================================================
// TEXT TO SPEECH
// =====================================================

function speak(text) {

    if (!("speechSynthesis" in window)) {

        return;
    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(text);


    utterance.lang = "en-US";

    utterance.rate = 0.95;


    window.speechSynthesis.speak(utterance);

}


// =====================================================
// SEND BUTTON
// =====================================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// =====================================================
// ENTER KEY
// =====================================================

input.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


// =====================================================
// CLEAR CHAT
// =====================================================

clearButton.addEventListener(
    "click",
    () => {

        chatBox.innerHTML = "";

        addMessage(
            "Chat cleared. How can I help you?",
            "bot"
        );

        window.speechSynthesis?.cancel();

        voiceStatus.textContent = "";

    }
);


// =====================================================
// STOP SPEECH
// =====================================================

stopSpeechButton.addEventListener(
    "click",
    () => {

        window.speechSynthesis?.cancel();

    }
);


// =====================================================
// BROWSER SPEECH RECOGNITION
// =====================================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();


    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.continuous = false;


    micButton.addEventListener(
        "click",
        () => {

            recognition.start();

            voiceStatus.textContent =
                "Listening... please speak.";

        }
    );


    recognition.onresult =
        (event) => {

            const transcript =
                event.results[0][0].transcript;


            input.value = transcript;


            voiceStatus.textContent =
                "Voice captured. Sending...";


            sendMessage();

        };


    recognition.onerror =
        (event) => {

            voiceStatus.textContent =
                "Voice input error: " +
                event.error;

        };


    recognition.onend =
        () => {

            if (
                voiceStatus.textContent ===
                "Listening... please speak."
            ) {

                voiceStatus.textContent =
                    "Voice input stopped.";

            }

        };

} else {

    micButton.disabled = true;

    voiceStatus.textContent =
        "Speech recognition is not supported by this browser.";

}


// =====================================================
// APPOINTMENT BOOKING
// =====================================================

const appointmentPanel =
    document.getElementById("appointmentPanel");

const appointmentForm =
    document.getElementById("appointmentForm");

const cancelAppointment =
    document.getElementById("cancelAppointment");

const appointmentResult =
    document.getElementById("appointmentResult");

const appointmentDate =
    document.getElementById("appointmentDate");


function openAppointmentForm() {

    appointmentPanel.classList.remove("hidden");

    appointmentDate.min =
        new Date().toISOString().split("T")[0];

    appointmentPanel.scrollIntoView({
        behavior: "smooth"
    });

}


if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            appointmentResult.textContent =
                "Booking...";


            const data = {

                patientName:
                    document.getElementById(
                        "patientName"
                    ).value.trim(),

                doctorName:
                    document.getElementById(
                        "doctorName"
                    ).value,

                appointmentDate:
                    appointmentDate.value,

                appointmentTime:
                    document.getElementById(
                        "appointmentTime"
                    ).value,

                reason:
                    document.getElementById(
                        "reason"
                    ).value.trim()

            };


            try {

                const response =
                    await fetch(
                        "/api/appointments",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Booking failed"
                    );

                }


                appointmentResult.textContent =
                    "✓ " +
                    result.message +
                    " Appointment ID: " +
                    result.appointment.id;


                addMessage(
                    "Appointment booked successfully. Appointment ID: " +
                    result.appointment.id,
                    "bot"
                );


                speak(
                    "Your appointment has been booked successfully."
                );


                appointmentForm.reset();


            } catch (error) {

                appointmentResult.textContent =
                    "Error: " +
                    error.message;

            }

        }
    );


    cancelAppointment.addEventListener(
        "click",
        () => {

            appointmentPanel.classList.add(
                "hidden"
            );

            appointmentForm.reset();

            appointmentResult.textContent = "";

        }
    );

}


// =====================================================
// HOSPITAL DIRECTORY
// =====================================================

const hospitalList =
    document.getElementById("hospitalList");

const findHospitalsButton =
    document.getElementById("findHospitals");


async function loadHospitals() {

    const city =
        document.getElementById(
            "hospitalCity"
        ).value.trim();


    const area =
        document.getElementById(
            "hospitalArea"
        ).value.trim();


    hospitalList.textContent =
        "Loading...";


    try {

        const params =
            new URLSearchParams();


        if (city) {

            params.set("city", city);

        }


        if (area) {

            params.set("area", area);

        }


        const response =
            await fetch(
                "/api/hospitals?" +
                params.toString()
            );


        if (!response.ok) {

            throw new Error(
                "Could not load hospitals."
            );

        }


        const hospitals =
            await response.json();


        if (!hospitals.length) {

            hospitalList.textContent =
                "No hospitals found for the selected filter.";

            return;
        }


        hospitalList.innerHTML =
            hospitals.map(
                h => `

                <div class="hospital-card">

                    <h3>
                        ${escapeHtml(h.name)}
                    </h3>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHtml(h.area || "")},
                        ${escapeHtml(h.city || "")}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${escapeHtml(
                            h.address ||
                            "Not available"
                        )}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${escapeHtml(
                            h.phone ||
                            "Not available"
                        )}
                    </p>

                    <p>
                        <strong>Specialties:</strong>
                        ${escapeHtml(
                            h.specialties ||
                            "General care"
                        )}
                    </p>

                </div>

            `
            ).join("");


    } catch (error) {

        hospitalList.textContent =
            error.message;

    }

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        c => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        }[c])
    );

}


findHospitalsButton.addEventListener(
    "click",
    loadHospitals
);


loadHospitals();


// =====================================================
// DOCTORS AND AVAILABLE SLOTS
// =====================================================

const doctorSelect =
    document.getElementById("doctorName");

const dateInput =
    document.getElementById("appointmentDate");

const timeSelect =
    document.getElementById("appointmentTime");

const doctorList =
    document.getElementById("doctorList");


async function loadDoctors() {

    try {

        const response =
            await fetch("/api/doctors");


        if (!response.ok) {

            throw new Error(
                "Could not load doctors."
            );

        }


        const doctors =
            await response.json();


        doctorSelect.innerHTML =
            '<option value="">Select doctor</option>';


        doctorList.innerHTML = "";


        doctors.forEach(
            d => {

                // Doctor dropdown
                const option =
                    document.createElement(
                        "option"
                    );


                option.value = d.name;


                option.textContent =
                    `${d.name} - ${d.specialty} (${d.hospitalName})`;


                doctorSelect.appendChild(
                    option
                );


                // Doctor card
                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "doctor-card";


                card.innerHTML =

                    `<h3>
                        ${escapeHtml(d.name)}
                    </h3>` +

                    `<p>
                        <strong>Specialty:</strong>
                        ${escapeHtml(d.specialty)}
                    </p>` +

                    `<p>
                        <strong>Hospital:</strong>
                        ${escapeHtml(d.hospitalName)}
                    </p>` +

                    `<p>
                        <strong>Consultation fee:</strong>
                        ${escapeHtml(
                            d.consultationFee ||
                            "Not specified"
                        )}
                    </p>`;


                doctorList.appendChild(
                    card
                );

            }
        );


    } catch (e) {

        doctorList.textContent =
            e.message;

    }

}


// =====================================================
// LOAD AVAILABLE SLOTS
// =====================================================

async function loadSlots() {

    const doctor =
        doctorSelect.value;

    const date =
        dateInput.value;


    timeSelect.innerHTML = "";

    timeSelect.disabled = true;


    if (!doctor || !date) {

        timeSelect.innerHTML =
            '<option value="">Select doctor and date first</option>';

        return;
    }


    timeSelect.innerHTML =
        '<option value="">Loading slots...</option>';


    try {

        const response =
            await fetch(
                `/api/slots?doctor=${encodeURIComponent(doctor)}&date=${encodeURIComponent(date)}`
            );


        const slots =
            await response.json();


        timeSelect.innerHTML = "";


        if (!slots.length) {

            timeSelect.innerHTML =
                '<option value="">No slots available</option>';

            return;
        }


        timeSelect.disabled = false;


        timeSelect.innerHTML =
            '<option value="">Select available time</option>';


        slots.forEach(
            slot => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value = slot;

                option.textContent = slot;


                timeSelect.appendChild(
                    option
                );

            }
        );


    } catch (e) {

        timeSelect.innerHTML =
            '<option value="">Could not load slots</option>';

    }

}


doctorSelect.addEventListener(
    "change",
    loadSlots
);


dateInput.addEventListener(
    "change",
    loadSlots
);


loadDoctors();