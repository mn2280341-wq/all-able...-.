
import speech_recognition as sr
import threading
import queue

class SpeechService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.is_listening = False
        self.audio_queue = queue.Queue()

    def listen_background(self, callback):
        """
        Starts listening in the background and calls the callback with the recognized text.
        """
        def callback_wrapper(recognizer, audio):
            try:
                text = recognizer.recognize_google(audio, language="ar-SA")
                callback(text)
            except sr.UnknownValueError:
                print("Speech Recognition could not understand audio")
            except sr.RequestError as e:
                print(f"Could not request results from Google Speech Recognition service; {e}")

        # Adjust for ambient noise
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)

        self.stop_listening = self.recognizer.listen_in_background(self.microphone, callback_wrapper)
        self.is_listening = True

    def stop(self):
        if self.is_listening and self.stop_listening:
            self.stop_listening(wait_for_stop=False)
            self.is_listening = False

speech_service = SpeechService()
