import { LightningElement, track } from 'lwc';

export default class VoiceToText extends LightningElement {
    @track transcript = '';
    recognition;
    finalTranscript = '';

    connectedCallback() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        this.finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                this.transcript = this.finalTranscript + interimTranscript;
            };

            this.recognition.onend = () => {
                this.transcript = this.finalTranscript;
                this.finalTranscript = ''; // Reset the final transcript after stopping
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error detected: ' + event.error);
            };
        } else {
            console.error('Speech recognition not supported in this browser.');
        }
    }

    startRecording() {
        if (this.recognition) {
            this.transcript = ''; // Clear previous transcript
            this.finalTranscript = ''; // Clear final transcript
            this.recognition.start();
        }
    }
}
