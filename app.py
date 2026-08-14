from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import threading
import os
import json
import google.generativeai as genai

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)  # Enable CORS for all routes

# Initialize Speech Recognizer
recognizer = sr.Recognizer()

# Initialize Text-to-Speech engine
try:
    tts_engine = pyttsx3.init()
except:
    print("Warning: pyttsx3 could not initialize. Voice output on server might be limited.")
    tts_engine = None

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    # This endpoint will receive audio data (implementation to be added)
    # For now, it's a placeholder for the logic
    return jsonify({"message": "Speech to text endpoint"})

@app.route('/api/process_video', methods=['POST'])
def process_video():
    # Placeholder for MediaPipe processing
    return jsonify({"message": "Video processing endpoint"})

@app.route('/api/voice-command', methods=['POST'])
def voice_command():
    data = request.json
    command = data.get('command', '')
    print(f"Received command: {command}")
    
    try:
        # Configure Gemini
        genai.configure(api_key="AIzaSyBaa1jCuPJ-MNL8OdGxWE2i1sfYIL-xQ-8") # Hardcoded from config.js for demo compatibility

        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        You are the intelligent agent for "AllAble". Your goal is to control the app interface based on the user's voice command.
        
        AVAILABLE TOOLS (Function Calling):
        1. navigate(page_name)
           - Pages: "social-media.html" (for social, facebook, youtube), "index.html" (home), "emergency.html" (help), "search.html" (search).
        
        2. set_theme(disability_type)
           - Types: "visual" (blind/low vision), "hearing" (deaf), "motor" (physical), "cognitive" (autism/intellectual).
        
        3. trigger_emergency()
           - Use ONLY if the user says they are in danger, hurt, falling, or asking for help explicitly.
        
        4. read_screen()
           - If user asks to read, describe, or summarize the current screen.

        COMMAND: "{command}"
        
        INSTRUCTIONS:
        - Analyze the intent.
        - Select the MOST appropriate tool.
        - Return ONLY JSON in this format:
          {{
            "action": "TOOL_NAME", 
            "parameter": "PARAMETER_VALUE_IF_NEEDED",
            "reply": "Friendly confirmation in Egyptian Arabic"
          }}
        
        EXAMPLES:
        - "وديني الفيس بوك" -> {{ "action": "navigate", "parameter": "social-media.html", "reply": "حاضر، هفتحلك السوشيال ميديا" }}
        - "مش شايف الكلام كبره" -> {{ "action": "set_theme", "parameter": "visual", "reply": "ولا يهمك، هكبرلك الخط واشغل القارئ الصوتي" }}
        - "الحقوني انا وقعت" -> {{ "action": "trigger_emergency", "parameter": "", "reply": "جاري طلب المساعدة فوراً!" }}
        """
        
        response = model.generate_content(prompt)
        # Clean response to ensure valid JSON
        json_str = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(json_str)
        
        print(f"AI Action: {result}")
        return jsonify({
            "status": "success",
            "action": result.get('action', 'UNKNOWN'),
            "parameter": result.get('parameter', ''),
            "reply": result.get('reply', 'حاضر')
        })

    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback security for emergency
        if 'مساعدة' in command or 'طوارئ' in command or 'الحقوني' in command:
             return jsonify({"status": "success", "action": "trigger_emergency", "reply": "طوارئ! جاري الاتصال"})
        
        return jsonify({
            "status": "error",
            "message": str(e),
            "reply": "معلش مفهمتش، ممكن تقول تاني؟"
        })

if __name__ == '__main__':
    print("Starting AllAble Server...")
    print("Application will be available at http://localhost:5000 and your network IP.")
    app.run(debug=True, host='0.0.0.0', port=5000)
