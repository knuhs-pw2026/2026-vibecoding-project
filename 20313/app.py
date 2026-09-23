from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# 전역 대화 내역 저장 (단순 데모용)
chat_histories = {}

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_text = data.get('message', '')
    session_id = data.get('session_id', 'default_user')
    api_key = data.get('api_key', '')
    
    if not api_key:
        return jsonify({"response": "⚠️ [시스템 알림] 화면 우측의 안내에 따라 Gemini API 키를 먼저 입력해 주세요!"})
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash',
            system_instruction="당신은 네이버, 카카오 등 주요 IT 기업의 수석 면접관입니다. "
                               "지원자의 자기소개서 내용과 답변을 바탕으로, 날카롭고 구체적인 꼬리 질문을 딱 1개만 생성하세요. "
                               "매우 전문적이고 격식있는 말투를 사용하며, 절대로 인삿말이나 불필요한 서론을 길게 늘어놓지 마세요. "
                               "지원자의 논리적 허점이나 기술적 깊이를 파고드는 예리한 질문을 해야 합니다."
        )

        if session_id not in chat_histories:
            chat_histories[session_id] = model.start_chat(history=[])
            
        chat_session = chat_histories[session_id]
        response = chat_session.send_message(user_text)
        return jsonify({"response": response.text.strip()})
        
    except Exception as e:
        print(f"API Generation Error: {e}")
        return jsonify({"response": "⚠️ [시스템 알림] API 연동 오류가 발생했습니다. 발급받으신 API 키가 정확한지 다시 확인해 주세요."})

if __name__ == '__main__':
    print("Starting SyncHire Backend with Google Gemini API (Dynamic Key Mode)...")
    app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=False)
