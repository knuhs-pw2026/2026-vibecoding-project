// 앱 시작 및 모드 설정
function startApp(mode = 'seeker') {
    document.getElementById('hero-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    document.getElementById('mode-toggle-container').classList.remove('hidden');
    document.getElementById('start-btn').classList.add('hidden');
    
    const toggle = document.getElementById('account-mode-toggle');
    toggle.checked = (mode === 'recruiter');
    toggleAccountMode(toggle);
    triggerToast('대시보드에 접속했습니다.');
}

// 홈으로 가기
function showSection(sectionId) {
    if(sectionId === 'hero-section') {
        document.getElementById('app-section').classList.add('hidden');
        document.getElementById('hero-section').classList.remove('hidden');
        document.getElementById('mode-toggle-container').classList.add('hidden');
        document.getElementById('start-btn').classList.remove('hidden');
    }
}

// 상단 모드 스위치
function toggleAccountMode(checkbox) {
    const isRecruiter = checkbox.checked;
    const seekerLabel = document.getElementById('mode-label-seeker');
    const recruiterLabel = document.getElementById('mode-label-recruiter');
    const seekerMenu = document.getElementById('seeker-menu');
    const recruiterMenu = document.getElementById('recruiter-menu');
    const profile = document.getElementById('sidebar-profile');
    
    if(isRecruiter) {
        seekerLabel.classList.remove('active-mode');
        recruiterLabel.classList.add('active-mode');
        seekerMenu.classList.add('hidden');
        recruiterMenu.classList.remove('hidden');
        profile.innerHTML = `<div class="avatar">🏢</div><div class="info"><strong>네이버 인사팀</strong><span>기업 계정 관리</span></div>`;
        document.querySelector('#recruiter-menu .nav-btn').click();
    } else {
        recruiterLabel.classList.remove('active-mode');
        seekerLabel.classList.add('active-mode');
        recruiterMenu.classList.add('hidden');
        seekerMenu.classList.remove('hidden');
        profile.innerHTML = `<div class="avatar">👨‍🎓</div><div class="info"><strong>취업준비생</strong><span>내 계정 관리</span></div>`;
        document.querySelector('#seeker-menu .nav-btn').click();
    }
}

// 글로벌 액션 트리거 (모든 버튼에 연결)
function triggerAction(action, context = '') {
    const modal = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    modal.classList.remove('hidden');
    
    switch(action) {
        case 'apply':
            title.textContent = '원클릭 지원 완료';
            body.innerHTML = `<strong>${context}</strong>에 내 자소서가 성공적으로 제출되었습니다.<br><br>담당자가 열람하면 알림을 보내드립니다.`;
            break;
        case 'save-resume':
            title.textContent = '자소서 저장됨';
            body.innerHTML = `생성된 자소서가 '내 이력서 관리' 탭에 저장되었습니다. 이제 기업들에게 프로필을 공개해보세요!`;
            break;
        case 'edit-resume':
            title.textContent = '자소서 수정';
            body.innerHTML = `자소서를 직접 다듬을 수 있습니다.<br><textarea>저는 컴퓨터공학과에서 수학하며 논리적 사고와 문제 해결 능력을 기를 수 있었습니다. 특히 해커톤 경험을 통해...</textarea>`;
            break;
        case 'view-trends':
            title.textContent = '트렌드 분석 보고서';
            body.innerHTML = `이번 달 IT 트렌드는 <strong>'대규모 트래픽 처리'</strong>와 <strong>'인프라 비용 최적화'</strong>입니다. 관련된 경험이 있다면 자소서 상단에 배치하는 것을 추천합니다.`;
            break;
        case 'diagnose':
            title.textContent = 'AI 자소서 진단';
            body.innerHTML = `지원자님의 자소서는 전반적으로 우수합니다. (상위 15%)<br><br><strong>보완점:</strong> 기술 스택(React, Node.js)을 나열하기보다, 해당 기술을 선택한 '이유'를 한 줄 추가하면 매력도가 40% 상승합니다.`;
            break;
        case 'view-resume':
            title.textContent = `${context} 지원자 이력서 열람`;
            body.innerHTML = `<strong>지원 분야:</strong> 프론트엔드 / 백엔드<br><strong>주요 기술:</strong> React, Python, AWS<br><br>"실무 중심의 프로젝트 경험과 끈질긴 트러블슈팅 능력을 갖춘 지원자입니다."`;
            break;
        case 'send-offer':
            title.textContent = '면접 제안 발송 완료';
            body.innerHTML = `<strong>${context}</strong> 님에게 다이렉트 면접 제안 메시지를 보냈습니다. 지원자가 수락하면 알림이 옵니다.`;
            break;
        case 'edit-job':
            title.textContent = '채용 공고 관리';
            body.innerHTML = `채용 공고의 자격 요건을 수정합니다.<br><textarea>필수 요건: React 최적화 경험, 3년 이상 경력 우대...</textarea>`;
            break;
        case 'accept':
            title.textContent = '합격 처리 완료';
            body.innerHTML = `<strong>${context}</strong> 님을 서류 합격 처리했습니다. 자동 면접 일정 조율 이메일이 발송되었습니다.`;
            break;
        case 'change-goal':
            title.textContent = '목표 직무 설정';
            body.innerHTML = `분석하고 싶은 목표 기업과 직무 키워드를 다시 입력하세요.<br><input type="text" style="width:100%; padding:0.8rem; margin-top:1rem; border-radius:8px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.2);" placeholder="예: 구글 소프트웨어 엔지니어">`;
            break;
        case 'request-coffee':
            title.textContent = '커피챗 요청 발송';
            body.innerHTML = `<strong>${context}</strong>님에게 1:1 화상 커피챗(15분)을 요청했습니다. 멘토가 수락하면 일정이 조율됩니다.`;
            break;
        case 'add-schedule':
            title.textContent = '새 일정 추가';
            body.innerHTML = `일정명: <input type="text" style="width:100%; padding:0.8rem; margin:10px 0; border-radius:8px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.2);"><br>날짜 선택: <input type="date" style="width:100%; padding:0.8rem; margin-bottom:10px; border-radius:8px; background:rgba(0,0,0,0.3); color:white; border:1px solid rgba(255,255,255,0.2);">`;
            break;
        case 'run-filter':
            title.textContent = 'AI 분석 완료';
            body.innerHTML = `420개의 이력서를 성공적으로 필터링했습니다.<br>우수 인재 35명을 인재 검색 대시보드에 최상단 배치했습니다.`;
            break;
        default:
            title.textContent = '알림';
            body.innerHTML = `해당 기능이 실행되었습니다.`;
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// 토스트 메시지
function triggerToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// AI 모의 면접 로직 (Flask 백엔드 연동)
async function sendInterviewAnswer() {
    const input = document.getElementById('interview-input');
    const text = input.value.trim();
    if(!text) return;

    const apiKey = document.getElementById('gemini-api-key').value.trim();
    
    if(!apiKey) {
        triggerToast('우측 안내창에 API 키를 먼저 입력해주세요!');
        document.getElementById('gemini-api-key').focus();
        return;
    }

    const chatArea = document.getElementById('chat-area');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `<div class="msg-avatar">👨‍🎓</div><div class="msg-bubble">${text}</div>`;
    chatArea.appendChild(userMsg);
    input.value = '';
    chatArea.scrollTop = chatArea.scrollHeight;

    // 로딩 표시
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message ai loading-msg';
    loadingMsg.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">AI 면접관이 답변을 생성중입니다...</div>`;
    chatArea.appendChild(loadingMsg);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        // 백엔드 API 호출
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, api_key: apiKey })
        });
        
        const data = await response.json();
        
        // 로딩 메시지 제거
        chatArea.removeChild(loadingMsg);
        
        // AI 메시지 렌더링
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message ai';
        aiMsg.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble">${data.response || "이해했습니다. 다음 질문으로 넘어가겠습니다."}</div>`;
        chatArea.appendChild(aiMsg);
        
    } catch (error) {
        chatArea.removeChild(loadingMsg);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message ai';
        errorMsg.innerHTML = `<div class="msg-avatar">⚠️</div><div class="msg-bubble">서버 오류: 백엔드 서버가 실행 중인지 확인해주세요.</div>`;
        chatArea.appendChild(errorMsg);
        console.error("AI fetch error:", error);
    }
    
    chatArea.scrollTop = chatArea.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewPanels = document.querySelectorAll('.view-panel');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            viewPanels.forEach(panel => panel.classList.add('hidden'));
            document.getElementById(btn.getAttribute('data-target')).classList.remove('hidden');
        });
    });

    // 폼 제출
    const form = document.getElementById('ai-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('placeholder').classList.add('hidden');
            document.getElementById('result').classList.add('hidden');
            document.getElementById('loading').classList.remove('hidden');
            triggerToast('AI 엔진 가동 중...');

            setTimeout(() => {
                const edu = document.getElementById('edu').value;
                const activity = document.getElementById('activity').value;
                const cert = document.getElementById('cert').value;
                document.getElementById('generated-text').textContent = `저는 ${edu}에서 수학하며 실무 중심의 기술을 쌓았습니다. 특히 ${activity} 경험을 통해 팀워크와 커뮤니케이션 능력을 키웠으며, ${cert} 자격을 바탕으로 기술적 전문성을 입증했습니다.`;
                document.getElementById('explanation-text').textContent = `입력하신 키워드(${edu}, ${activity}, ${cert})를 기반으로 '협업'과 '전문성'에 초점을 맞추어 기업들이 가장 선호하는 패턴으로 작성되었습니다.`;
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('result').classList.remove('hidden');
            }, 1500);
        });
    }

    const interviewInput = document.getElementById('interview-input');
    if(interviewInput) {
        interviewInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendInterviewAnswer(); });
    }
    document.getElementById('send-interview-btn').addEventListener('click', sendInterviewAnswer);
});
