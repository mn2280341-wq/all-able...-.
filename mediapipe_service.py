
import cv2
import mediapipe as mp
import numpy as np

class MediaPipeService:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils

    def process_frame(self, frame_rgb):
        """
        Process a single frame for hand landmarks.
        Returns the processed frame with landmarks drawn and the landmarks data.
        """
        results = self.hands.process(frame_rgb)
        
        landmarks_data = []
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Convert landmarks to a list of dictionaries
                hand_data = []
                for id, lm in enumerate(hand_landmarks.landmark):
                    hand_data.append({
                        'id': id,
                        'x': lm.x,
                        'y': lm.y,
                        'z': lm.z
                    })
                landmarks_data.append(hand_data)
                
        return results, landmarks_data

    def draw_landmarks(self, frame, results):
        """
        Draws landmarks on the frame.
        """
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                self.mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    self.mp_hands.HAND_CONNECTIONS
                )
        return frame

mediapipe_service = MediaPipeService()
