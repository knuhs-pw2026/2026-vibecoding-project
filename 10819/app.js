// VibeTune Application Controller
// Web Audio Synth, Interactive Player, Real-time Algorithm Dispatcher, and UI Manager

(function() {
  'use strict';

  // Instantiate Recommendation Engine
  const engine = new MusicRecommendationEngine(MUSIC_CATALOG);

  // App State
  const state = {
    likedSongIds: new Set(JSON.parse(localStorage.getItem('vibetune_liked_songs') || '[]')),
    savedSongIds: new Set(JSON.parse(localStorage.getItem('vibetune_saved_songs') || '[]')),
    surveyAnswers: JSON.parse(localStorage.getItem('vibetune_survey_answers') || '{}'),
    activeQuickTag: 'all',
    searchQuery: '',
    currentTrack: null,
    isPlaying: false,
    trackDuration: 30, // 30 second preview
    trackCurrentTime: 0,
    activePlaylist: [...MUSIC_CATALOG],
    currentPlaylistIndex: 0,
    surveyStep: 0,
    surveyDraftAnswers: {}
  };

  // DOM Elements
  const DOM = {
    brandLogo: document.getElementById('brandLogo'),
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    openSurveyBtn: document.getElementById('openSurveyBtn'),
    openLibraryBtn: document.getElementById('openLibraryBtn'),
    libraryCountBadge: document.getElementById('libraryCountBadge'),
    quickTagsContainer: document.getElementById('quickTagsContainer'),
    
    // Taste Profile
    tasteSummaryBar: document.getElementById('tasteSummaryBar'),
    tasteSummaryText: document.getElementById('tasteSummaryText'),
    acousticScoreText: document.getElementById('acousticScoreText'),
    acousticBar: document.getElementById('acousticBar'),
    energyScoreText: document.getElementById('energyScoreText'),
    energyBar: document.getElementById('energyBar'),
    topTagsContainer: document.getElementById('topTagsContainer'),

    // Algorithm Section
    algorithmSection: document.getElementById('algorithmSection'),
    algorithmEmptyState: document.getElementById('algorithmEmptyState'),
    algorithmCardsGrid: document.getElementById('algorithmCardsGrid'),

    // Main Recommendations
    recommendationHeading: document.getElementById('recommendationHeading'),
    recommendationSubheading: document.getElementById('recommendationSubheading'),
    resetFilterBtn: document.getElementById('resetFilterBtn'),
    mainCardsGrid: document.getElementById('mainCardsGrid'),

    // Player Elements
    musicPlayer: document.getElementById('musicPlayer'),
    playerThumb: document.getElementById('playerThumb'),
    playerTitle: document.getElementById('playerTitle'),
    playerArtist: document.getElementById('playerArtist'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    prevTrackBtn: document.getElementById('prevTrackBtn'),
    nextTrackBtn: document.getElementById('nextTrackBtn'),
    currentTimeLabel: document.getElementById('currentTimeLabel'),
    totalTimeLabel: document.getElementById('totalTimeLabel'),
    progressBarContainer: document.getElementById('progressBarContainer'),
    progressBarFill: document.getElementById('progressBarFill'),
    volumeSlider: document.getElementById('volumeSlider'),
    volumeIcon: document.getElementById('volumeIcon'),
    visualizerCanvas: document.getElementById('audioVisualizerCanvas'),

    // Modals
    surveyModal: document.getElementById('surveyModal'),
    closeSurveyBtn: document.getElementById('closeSurveyBtn'),
    surveyStepContent: document.getElementById('surveyStepContent'),
    surveyPrevBtn: document.getElementById('surveyPrevBtn'),
    surveyNextBtn: document.getElementById('surveyNextBtn'),
    surveyStepText: document.getElementById('surveyStepText'),
    stepDot1: document.getElementById('stepDot1'),
    stepDot2: document.getElementById('stepDot2'),
    stepDot3: document.getElementById('stepDot3'),

    libraryModal: document.getElementById('libraryModal'),
    closeLibraryBtn: document.getElementById('closeLibraryBtn'),
    libraryTrackList: document.getElementById('libraryTrackList'),
    clearLibraryBtn: document.getElementById('clearLibraryBtn'),
    playAllLibraryBtn: document.getElementById('playAllLibraryBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // ==========================================
  // Web Audio API Synthesizer & Audio Visualizer
  // ==========================================
  let audioCtx = null;
  let masterGain = null;
  let analyserNode = null;
  let synthInterval = null;
  let progressInterval = null;
  let animationFrameId = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.value = parseFloat(DOM.volumeSlider.value);

      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;

      masterGain.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);

      startVisualizer();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Harmonic Chord Synthesizer tailored to each track
  function playSynthChordSequence(soundProfile) {
    if (!audioCtx) return;
    stopSynthChordSequence();

    const chords = soundProfile?.chords || [261.63, 329.63, 392.00, 523.25];
    const type = soundProfile?.type || 'acoustic_guitar';
    let stepIndex = 0;

    function playNote(freq, startTime, duration, waveType = 'sine') {
      try {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        
        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, startTime);

        // Attack & Decay Envelope
        noteGain.gain.setValueAtTime(0.001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch (e) {
        // Safe fail
      }
    }

    function triggerChord() {
      if (!state.isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;

      if (type === 'synthwave') {
        // Bright 80s synth arpeggio
        chords.forEach((freq, idx) => {
          playNote(freq, now + (idx * 0.15), 0.6, 'sawtooth');
        });
      } else if (type === 'lofi_chill') {
        // Warm mellow electric piano
        chords.forEach((freq, idx) => {
          playNote(freq * 0.5, now + (idx * 0.08), 1.2, 'triangle');
          playNote(freq, now + (idx * 0.08) + 0.02, 1.0, 'sine');
        });
      } else if (type === 'acoustic_guitar') {
        // Fingerstyle guitar strums
        chords.forEach((freq, idx) => {
          playNote(freq, now + (idx * 0.06), 0.9, 'triangle');
        });
      } else if (type === 'piano_ballad') {
        // Soft grand piano chords
        chords.forEach((freq) => {
          playNote(freq, now, 1.4, 'sine');
          playNote(freq * 2, now + 0.05, 1.0, 'sine');
        });
      } else if (type === 'jazz_saxophone') {
        // Soulful, breathy saxophone tones
        chords.forEach((freq, idx) => {
          playNote(freq, now + (idx * 0.12), 1.6, 'sine');
          playNote(freq * 1.5, now + (idx * 0.12) + 0.04, 1.2, 'triangle');
        });
      } else if (type === 'jazz_piano') {
        // Sophisticated 7th/9th jazz piano voicings with bass
        playNote(chords[0] * 0.5, now, 1.8, 'sine');
        chords.forEach((freq, idx) => {
          playNote(freq, now + (idx * 0.06), 1.5, 'triangle');
        });
      } else if (type === 'jazz_swing') {
        // Bouncy jazz swing rhythm
        playNote(chords[0] * 0.5, now, 0.45, 'sine');
        playNote(chords[0] * 0.5, now + 0.45, 0.45, 'sine');
        chords.slice(1).forEach((freq, idx) => {
          playNote(freq, now + 0.22 + (idx * 0.03), 0.55, 'triangle');
          playNote(freq, now + 0.67 + (idx * 0.03), 0.50, 'triangle');
        });
      } else {
        // Dreampop / Surf Pop
        chords.forEach((freq, idx) => {
          playNote(freq, now + (idx * 0.12), 1.1, 'sine');
        });
      }
      stepIndex++;
    }

    triggerChord();
    synthInterval = setInterval(triggerChord, 1600);
  }

  function stopSynthChordSequence() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  // Audio Canvas Visualizer
  function startVisualizer() {
    if (!DOM.visualizerCanvas || !analyserNode) return;
    const canvas = DOM.visualizerCanvas;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      animationFrameId = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let barHeight = (dataArray[i] / 255) * canvas.height;
        if (!state.isPlaying) {
          barHeight = Math.sin(Date.now() / 300 + i) * 3 + 4; // Idle gentle pulse
        }

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

        x += barWidth + 1;
      }
    }
    draw();
  }

  // ==========================================
  // Music Playback Management
  // ==========================================
  function playTrack(track, playlist = null) {
    initAudioContext();

    if (playlist) {
      state.activePlaylist = playlist;
      state.currentPlaylistIndex = playlist.findIndex(t => t.id === track.id);
    }

    state.currentTrack = track;
    state.isPlaying = true;
    state.trackCurrentTime = 0;

    // Update Player UI
    DOM.playerThumb.src = track.albumArt;
    DOM.playerTitle.textContent = track.title;
    DOM.playerArtist.textContent = `${track.artist} • ${track.genre}`;
    DOM.playPauseBtn.textContent = '⏸';
    DOM.playPauseBtn.setAttribute('title', '일시정지');

    // Trigger synth audio
    playSynthChordSequence(track.soundProfile);

    // Timeline progress tracking
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (state.isPlaying) {
        state.trackCurrentTime += 0.25;
        if (state.trackCurrentTime >= state.trackDuration) {
          // Play next track automatically
          playNextTrack();
        } else {
          updateProgressBar();
        }
      }
    }, 250);

    updateCardPlayingStyles();
  }

  function pauseTrack() {
    state.isPlaying = false;
    DOM.playPauseBtn.textContent = '▶';
    DOM.playPauseBtn.setAttribute('title', '재생');
    stopSynthChordSequence();
    updateCardPlayingStyles();
  }

  function resumeTrack() {
    if (!state.currentTrack) {
      if (state.activePlaylist.length > 0) {
        playTrack(state.activePlaylist[0]);
      }
      return;
    }
    initAudioContext();
    state.isPlaying = true;
    DOM.playPauseBtn.textContent = '⏸';
    DOM.playPauseBtn.setAttribute('title', '일시정지');
    playSynthChordSequence(state.currentTrack.soundProfile);
    updateCardPlayingStyles();
  }

  function playNextTrack() {
    if (!state.activePlaylist || state.activePlaylist.length === 0) return;
    state.currentPlaylistIndex = (state.currentPlaylistIndex + 1) % state.activePlaylist.length;
    playTrack(state.activePlaylist[state.currentPlaylistIndex]);
  }

  function playPrevTrack() {
    if (!state.activePlaylist || state.activePlaylist.length === 0) return;
    state.currentPlaylistIndex = (state.currentPlaylistIndex - 1 + state.activePlaylist.length) % state.activePlaylist.length;
    playTrack(state.activePlaylist[state.currentPlaylistIndex]);
  }

  function updateProgressBar() {
    const percent = (state.trackCurrentTime / state.trackDuration) * 100;
    DOM.progressBarFill.style.width = `${Math.min(100, percent)}%`;

    const mins = Math.floor(state.trackCurrentTime / 60);
    const secs = Math.floor(state.trackCurrentTime % 60);
    DOM.currentTimeLabel.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateCardPlayingStyles() {
    document.querySelectorAll('.music-card').forEach(card => {
      const songId = card.getAttribute('data-song-id');
      if (state.currentTrack && songId === state.currentTrack.id && state.isPlaying) {
        card.classList.add('playing');
        const playBtnIcon = card.querySelector('.play-circle-btn');
        if (playBtnIcon) playBtnIcon.textContent = '⏸';
      } else {
        card.classList.remove('playing');
        const playBtnIcon = card.querySelector('.play-circle-btn');
        if (playBtnIcon) playBtnIcon.textContent = '▶';
      }
    });
  }

  // ==========================================
  // Like & Save Actions + Real-time Trigger
  // ==========================================
  function toggleLikeSong(songId) {
    const song = MUSIC_CATALOG.find(s => s.id === songId);
    if (!song) return;

    if (state.likedSongIds.has(songId)) {
      state.likedSongIds.delete(songId);
      showToast('💔', `'${song.title}' 좋아요를 취소했습니다.`);
    } else {
      state.likedSongIds.add(songId);
      showToast('❤️', `'${song.title}'을(를) 좋아합니다! 알고리즘이 새로운 유사곡을 발견했습니다.`);
    }

    saveState();
    updateUI();
  }

  function toggleSaveSong(songId) {
    const song = MUSIC_CATALOG.find(s => s.id === songId);
    if (!song) return;

    if (state.savedSongIds.has(songId)) {
      state.savedSongIds.delete(songId);
      showToast('🗑️', `'${song.title}' 보관을 취소했습니다.`);
    } else {
      state.savedSongIds.add(songId);
      showToast('➕', `'${song.title}'을(를) 보관함에 담았습니다.`);
    }

    saveState();
    updateUI();
  }

  function saveState() {
    localStorage.setItem('vibetune_liked_songs', JSON.stringify(Array.from(state.likedSongIds)));
    localStorage.setItem('vibetune_saved_songs', JSON.stringify(Array.from(state.savedSongIds)));
    localStorage.setItem('vibetune_survey_answers', JSON.stringify(state.surveyAnswers));
  }

  // ==========================================
  // Rendering UI & Algorithms
  // ==========================================
  function updateUI() {
    // 1. Update Library Badge
    const totalLibraryCount = state.likedSongIds.size + state.savedSongIds.size;
    DOM.libraryCountBadge.textContent = totalLibraryCount;

    // 2. Render Dynamic Liked-based Algorithm Recommendations
    renderAlgorithmRecommendations();

    // 3. Render Main Survey-based & Filtered Recommendations
    renderMainRecommendations();

    // 4. Update Taste Profile Bar
    updateTasteProfileBar();

    // 5. Update Playing styling
    updateCardPlayingStyles();
  }

  // 핵심 기능 1: 사용자가 좋아요를 누르면 실시간으로 띄워주는 유사곡 피드
  function renderAlgorithmRecommendations() {
    const likedList = Array.from(state.likedSongIds);
    const savedList = Array.from(state.savedSongIds);

    if (likedList.length === 0 && savedList.length === 0) {
      DOM.algorithmEmptyState.style.display = 'block';
      DOM.algorithmCardsGrid.style.display = 'none';
      DOM.algorithmCardsGrid.innerHTML = '';
      return;
    }

    DOM.algorithmEmptyState.style.display = 'none';
    DOM.algorithmCardsGrid.style.display = 'grid';

    // Calculate Content-Based Similarity Recommendations
    const recommendations = engine.getSimilarRecommendationsForLikedSongs(likedList, savedList, 4);

    DOM.algorithmCardsGrid.innerHTML = recommendations.map(song => createMusicCardHtml(song, true)).join('');
  }

  // 핵심 기능 2: 설문 및 강력한 검색 기반 메인 추천 피드
  function renderMainRecommendations() {
    let list = engine.calculateSurveyMatches(state.surveyAnswers);
    const hasSearch = Boolean(state.searchQuery && state.searchQuery.trim());

    // Update clear button visibility
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.style.display = hasSearch ? 'flex' : 'none';
    }

    // Filter by Quick Mood Tag only when NOT searching (Search takes priority to find all matches across catalog)
    if (!hasSearch && state.activeQuickTag && state.activeQuickTag !== 'all') {
      const tagDef = QUICK_TAGS.find(q => q.id === state.activeQuickTag);
      if (tagDef && tagDef.tag) {
        list = list.filter(song => 
          song.vibeTags.includes(tagDef.tag) || 
          song.genre.includes(tagDef.tag) ||
          song.subGenres.some(sg => sg.includes(tagDef.tag)) ||
          song.situation === state.activeQuickTag
        );
      }
    }

    // Filter by Search Query with Intelligent Semantic Vibe & Mood Engine
    if (hasSearch) {
      const searchResult = engine.searchBySemanticMood(state.searchQuery);
      list = searchResult.matches;

      // Update Section Header for Search
      if (searchResult.isSemantic && searchResult.semanticLabel) {
        DOM.recommendationHeading.innerHTML = `🔍 '<span style="color: #f472b6;">${escapeHtml(state.searchQuery.trim())}</span>' 감성 연관 추천 <span class="badge-count" style="vertical-align: middle; margin-left: 8px;">${list.length}곡</span>`;
        DOM.recommendationSubheading.textContent = list.length > 0
          ? `${searchResult.semanticLabel}에 어울리는 감성 큐레이션 트랙입니다.`
          : `입력하신 감성에 부합하는 노래를 찾지 못했습니다.`;
      } else {
        DOM.recommendationHeading.innerHTML = `🔍 '<span style="color: #f472b6;">${escapeHtml(state.searchQuery.trim())}</span>' 검색 결과 <span class="badge-count" style="vertical-align: middle; margin-left: 8px;">${list.length}곡</span>`;
        DOM.recommendationSubheading.textContent = list.length > 0
          ? `입력하신 키워드와 가장 잘 어울리는 추천 음악입니다.`
          : `일치하는 감성의 노래를 찾지 못했습니다. 다른 단어나 무드를 검색해보세요.`;
      }
    } else {
      // Restore normal heading when not searching
      if (state.activeQuickTag !== 'all') {
        const tagDef = QUICK_TAGS.find(q => q.id === state.activeQuickTag);
        DOM.recommendationHeading.innerHTML = `${tagDef ? tagDef.icon + ' ' + tagDef.label : '선택된 감성'} <span class="badge-count" style="vertical-align: middle; margin-left: 8px;">${list.length}곡</span>`;
        DOM.recommendationSubheading.textContent = '선택하신 분위기 테마에 꼭 맞는 추천 큐레이션입니다.';
      } else if (Object.keys(state.surveyAnswers).length > 0) {
        DOM.recommendationHeading.innerHTML = `🎯 진단 결과 맞춤 큐레이션 <span class="badge-count" style="vertical-align: middle; margin-left: 8px;">${list.length}곡</span>`;
        DOM.recommendationSubheading.textContent = '취향 진단 서베이에 응답해주신 스타일에 가장 부합하는 트랙입니다.';
      } else {
        DOM.recommendationHeading.textContent = '✨ 감성 맞춤 추천 트랙';
        DOM.recommendationSubheading.textContent = '현재 선택된 무드와 스타일에 가장 잘 어울리는 큐레이션 리스트입니다.';
      }
    }

    // Check if any filters are applied
    const hasFilters = (state.activeQuickTag !== 'all') || hasSearch || Object.keys(state.surveyAnswers).length > 0;
    DOM.resetFilterBtn.style.display = hasFilters ? 'inline-flex' : 'none';

    if (list.length === 0) {
      DOM.mainCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); border: 1px dashed rgba(255,255,255,0.1);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; color: var(--text-main); margin-bottom: 6px;">'${escapeHtml(state.searchQuery)}' 검색 결과가 없습니다</h3>
          <p style="font-size: 14px; margin-bottom: 16px;">다른 감성 키워드(예: <strong>슬픈, 힐링, 재즈, 비 오는 날, 로파이</strong> 등)를 검색해보세요.</p>
          <button class="btn btn-primary" onclick="window.VibeTuneApp.handleResetFilters()" style="margin: 0 auto;">
            전체 곡 보기
          </button>
        </div>
      `;
      return;
    }

    DOM.mainCardsGrid.innerHTML = list.map(song => createMusicCardHtml(song, false)).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 카드 렌더링 헬퍼
  function createMusicCardHtml(song, isAlgorithmFeed = false) {
    const isLiked = state.likedSongIds.has(song.id);
    const isSaved = state.savedSongIds.has(song.id);
    const isCurrentPlaying = state.currentTrack && state.currentTrack.id === song.id && state.isPlaying;

    const score = isAlgorithmFeed ? song.algorithmScore : song.matchScore;
    const scoreBadgeText = isAlgorithmFeed ? `🔥 취향 유사도 ${score}%` : `✨ 매칭 ${score}%`;
    const scoreClass = isAlgorithmFeed ? 'card-score-badge highlight-algorithm' : 'card-score-badge';

    return `
      <div class="music-card ${isCurrentPlaying ? 'playing' : ''}" data-song-id="${song.id}">
        <!-- Cover Art & Play Button -->
        <div class="card-cover-wrapper">
          <img src="${song.albumArt}" alt="${song.title} 앨범 커버" class="card-cover" loading="lazy">
          <div class="${scoreClass}">
            ${scoreBadgeText}
          </div>
          <div class="card-play-overlay" onclick="window.VibeTuneApp.handleCardPlay('${song.id}')">
            <div class="play-circle-btn">${isCurrentPlaying ? '⏸' : '▶'}</div>
          </div>
        </div>

        <!-- Content -->
        <div class="card-content">
          <div class="card-header-row">
            <h3 class="card-title" title="${song.title}">${song.title}</h3>
          </div>
          <div class="card-artist">${song.artist} • ${song.genre}</div>

          ${isAlgorithmFeed && song.reasonText ? `
            <div class="card-reason-tag">${song.reasonText}</div>
          ` : ''}

          ${!isAlgorithmFeed && song.semanticBadge ? `
            <div class="card-reason-tag" style="background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.35); color: #c7d2fe;">${song.semanticBadge}</div>
          ` : ''}

          <div class="card-curator-comment">
            "${song.curatorComment}"
          </div>

          <!-- Tags -->
          <div class="card-tags">
            ${song.vibeTags.map(tag => `<span class="tag-badge" onclick="window.VibeTuneApp.handleTagClick('${escapeHtml(tag)}')" title="'#${escapeHtml(tag)}' 감성 음악 모아보기">#${escapeHtml(tag)}</span>`).join('')}
          </div>

          <!-- Bottom Action Buttons (Like & Save) -->
          <div class="card-actions">
            <div class="card-metric-pill">
              <span>BPM ${song.bpm}</span>
              <span>•</span>
              <span>어쿠스틱 ${song.acousticness}%</span>
            </div>
            <div class="card-action-btns">
              <button 
                class="icon-btn ${isSaved ? 'saved' : ''}" 
                onclick="window.VibeTuneApp.handleToggleSave('${song.id}')" 
                title="${isSaved ? '보관함에서 제거' : '보관함에 저장'}"
              >
                ${isSaved ? '📑' : '➕'}
              </button>
              <button 
                class="icon-btn ${isLiked ? 'liked' : ''}" 
                onclick="window.VibeTuneApp.handleToggleLike('${song.id}')" 
                title="${isLiked ? '좋아요 취소' : '좋아요'}"
              >
                ${isLiked ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 취향 프로필 대시보드 업데이트
  function updateTasteProfileBar() {
    const profile = engine.getUserTasteProfile(Array.from(state.likedSongIds), Array.from(state.savedSongIds));
    if (!profile) {
      DOM.tasteSummaryBar.style.display = 'none';
      return;
    }

    DOM.tasteSummaryBar.style.display = 'flex';
    DOM.acousticScoreText.textContent = `${profile.avgAcoustic}%`;
    DOM.acousticBar.style.width = `${profile.avgAcoustic}%`;

    DOM.energyScoreText.textContent = `${profile.avgEnergy}%`;
    DOM.energyBar.style.width = `${profile.avgEnergy}%`;

    DOM.tasteSummaryText.textContent = `🎧 총 ${profile.totalLiked}곡의 취향 데이터 학습 완료`;

    DOM.topTagsContainer.innerHTML = profile.topTags.map(t => `
      <span class="tag-badge" style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border-color: rgba(99, 102, 241, 0.3);">
        #${t.tag} (${t.percent}%)
      </span>
    `).join('');
  }

  // ==========================================
  // Quick Mood Tags Rendering
  // ==========================================
  function renderQuickTags() {
    DOM.quickTagsContainer.innerHTML = QUICK_TAGS.map(q => `
      <button 
        class="quick-tag-chip ${state.activeQuickTag === q.id ? 'active' : ''}" 
        data-tag-id="${q.id}"
      >
        <span>${q.icon}</span>
        <span>${q.label}</span>
      </button>
    `).join('');

    DOM.quickTagsContainer.querySelectorAll('.quick-tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tagId = chip.getAttribute('data-tag-id');
        state.activeQuickTag = tagId;
        renderQuickTags();
        renderMainRecommendations();
      });
    });
  }

  // ==========================================
  // 3-Step Survey Wizard
  // ==========================================
  function openSurveyModal() {
    state.surveyStep = 0;
    state.surveyDraftAnswers = { ...state.surveyAnswers };
    renderSurveyStep();
    DOM.surveyModal.classList.add('open');
  }

  function closeSurveyModal() {
    DOM.surveyModal.classList.remove('open');
  }

  function renderSurveyStep() {
    const q = SURVEY_QUESTIONS[state.surveyStep];
    if (!q) return;

    // Step dots
    DOM.stepDot1.className = `step-dot ${state.surveyStep >= 0 ? 'active' : ''}`;
    DOM.stepDot2.className = `step-dot ${state.surveyStep >= 1 ? 'active' : ''}`;
    DOM.stepDot3.className = `step-dot ${state.surveyStep >= 2 ? 'active' : ''}`;

    DOM.surveyStepText.textContent = `${state.surveyStep + 1} / 3 단계`;
    DOM.surveyPrevBtn.style.visibility = state.surveyStep > 0 ? 'visible' : 'hidden';
    DOM.surveyNextBtn.textContent = state.surveyStep === 2 ? '🎉 맞춤 추천 받기' : '다음 단계';

    const currentSelectedId = state.surveyDraftAnswers[q.id];

    DOM.surveyStepContent.innerHTML = `
      <div class="step-question-box">
        <h4 class="step-question-title">${q.title}</h4>
        <p class="step-question-sub">${q.subtitle}</p>
        <div class="survey-options-grid">
          ${q.options.map(opt => `
            <div 
              class="survey-option-card ${currentSelectedId === opt.id ? 'selected' : ''}" 
              data-opt-id="${opt.id}"
              onclick="window.VibeTuneApp.selectSurveyOption('${q.id}', '${opt.id}')"
            >
              <span class="opt-label">${opt.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function selectSurveyOption(questionId, optionId) {
    state.surveyDraftAnswers[questionId] = optionId;
    renderSurveyStep();
  }

  function nextSurveyStep() {
    if (state.surveyStep < 2) {
      state.surveyStep++;
      renderSurveyStep();
    } else {
      // Finished
      state.surveyAnswers = { ...state.surveyDraftAnswers };
      saveState();
      closeSurveyModal();
      showToast('🎯', '취향 스타일 진단 완료! 맞춤 트랙들이 상단에 정렬되었습니다.');
      DOM.recommendationHeading.textContent = '🎯 진단 결과 맞춤 큐레이션';
      updateUI();
    }
  }

  function prevSurveyStep() {
    if (state.surveyStep > 0) {
      state.surveyStep--;
      renderSurveyStep();
    }
  }

  // ==========================================
  // Library Modal
  // ==========================================
  function openLibraryModal() {
    const likedSongs = MUSIC_CATALOG.filter(s => state.likedSongIds.has(s.id) || state.savedSongIds.has(s.id));

    if (likedSongs.length === 0) {
      DOM.libraryTrackList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 32px; margin-bottom: 8px;">📭</div>
          <p>아직 보관함에 담긴 곡이 없습니다.<br>노래 카드의 하트(❤️)를 눌러 곡을 모아보세요!</p>
        </div>
      `;
    } else {
      DOM.libraryTrackList.innerHTML = likedSongs.map(song => {
        const isLiked = state.likedSongIds.has(song.id);
        const isSaved = state.savedSongIds.has(song.id);
        return `
          <div class="library-track-item">
            <div class="library-track-left">
              <img src="${song.albumArt}" alt="${song.title}" class="library-track-thumb">
              <div>
                <strong style="display: block; font-size: 14px;">${song.title}</strong>
                <span style="font-size: 12px; color: var(--text-muted);">${song.artist} • ${song.genre}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-glass" style="padding: 6px 12px; font-size: 12px;" onclick="window.VibeTuneApp.handlePlayFromLibrary('${song.id}')">
                ▶ 재생
              </button>
              <button class="icon-btn liked" onclick="window.VibeTuneApp.handleToggleLike('${song.id}')">
                ${isLiked ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    DOM.libraryModal.classList.add('open');
  }

  function closeLibraryModal() {
    DOM.libraryModal.classList.remove('open');
  }

  function clearLibrary() {
    if (confirm('보관함의 모든 곡을 비우시겠습니까?')) {
      state.likedSongIds.clear();
      state.savedSongIds.clear();
      saveState();
      updateUI();
      openLibraryModal();
      showToast('🗑️', '보관함이 초기화되었습니다.');
    }
  }

  function playAllLibrary() {
    const list = MUSIC_CATALOG.filter(s => state.likedSongIds.has(s.id) || state.savedSongIds.has(s.id));
    if (list.length > 0) {
      closeLibraryModal();
      playTrack(list[0], list);
      showToast('▶️', '보관함 곡들을 연속 재생합니다.');
    } else {
      alert('보관함에 담긴 곡이 없습니다.');
    }
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  function showToast(icon, message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  // ==========================================
  // Event Bindings
  // ==========================================
  function initEvents() {
    // Search input (Real-time live typing)
    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (state.searchQuery.trim() && state.activeQuickTag !== 'all') {
        state.activeQuickTag = 'all';
        renderQuickTags();
      }
      renderMainRecommendations();
    });

    // Search Enter key -> smooth scroll to recommendations
    DOM.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const targetSec = document.getElementById('recommendationsSection');
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    // Clear search button
    if (DOM.searchClearBtn) {
      DOM.searchClearBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        state.searchQuery = '';
        renderMainRecommendations();
        DOM.searchInput.focus();
      });
    }

    // Reset filters
    DOM.resetFilterBtn.addEventListener('click', () => {
      resetAllFilters();
    });

    // Modals
    DOM.openSurveyBtn.addEventListener('click', openSurveyModal);
    DOM.closeSurveyBtn.addEventListener('click', closeSurveyModal);
    DOM.surveyPrevBtn.addEventListener('click', prevSurveyStep);
    DOM.surveyNextBtn.addEventListener('click', nextSurveyStep);

    DOM.openLibraryBtn.addEventListener('click', openLibraryModal);
    DOM.closeLibraryBtn.addEventListener('click', closeLibraryModal);
    DOM.clearLibraryBtn.addEventListener('click', clearLibrary);
    DOM.playAllLibraryBtn.addEventListener('click', playAllLibrary);

    // Close on overlay backdrop click
    DOM.surveyModal.addEventListener('click', (e) => {
      if (e.target === DOM.surveyModal) closeSurveyModal();
    });
    DOM.libraryModal.addEventListener('click', (e) => {
      if (e.target === DOM.libraryModal) closeLibraryModal();
    });

    // Player Controls
    DOM.playPauseBtn.addEventListener('click', () => {
      if (state.isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    });

    DOM.nextTrackBtn.addEventListener('click', playNextTrack);
    DOM.prevTrackBtn.addEventListener('click', playPrevTrack);

    // Progress bar click to seek
    DOM.progressBarContainer.addEventListener('click', (e) => {
      const rect = DOM.progressBarContainer.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      state.trackCurrentTime = clickPos * state.trackDuration;
      updateProgressBar();
    });

    // Volume Slider
    DOM.volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
      }
      DOM.volumeIcon.textContent = val === 0 ? '🔇' : (val < 0.4 ? '🔉' : '🔊');
    });

    // Logo click reset
    DOM.brandLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // Global API Hook for Inlined Event Handlers
  // ==========================================
  window.VibeTuneApp = {
    handleCardPlay: (songId) => {
      const song = MUSIC_CATALOG.find(s => s.id === songId);
      if (!song) return;

      if (state.currentTrack && state.currentTrack.id === song.id && state.isPlaying) {
        pauseTrack();
      } else {
        playTrack(song);
      }
    },
    handleToggleLike: (songId) => {
      toggleLikeSong(songId);
    },
    handleToggleSave: (songId) => {
      toggleSaveSong(songId);
    },
    selectSurveyOption: (qId, optId) => {
      selectSurveyOption(qId, optId);
    },
    handlePlayFromLibrary: (songId) => {
      const song = MUSIC_CATALOG.find(s => s.id === songId);
      if (song) {
        playTrack(song);
        closeLibraryModal();
      }
    },
    handleResetFilters: () => {
      resetAllFilters();
    },
    handleTagClick: (tag) => {
      DOM.searchInput.value = tag;
      state.searchQuery = tag;
      if (state.activeQuickTag !== 'all') {
        state.activeQuickTag = 'all';
        renderQuickTags();
      }
      renderMainRecommendations();
      const targetSec = document.getElementById('recommendationsSection');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      showToast('🏷️', `'#${tag}' 감성 태그 음악을 탐색합니다.`);
    }
  };

  function resetAllFilters() {
    state.activeQuickTag = 'all';
    state.searchQuery = '';
    state.surveyAnswers = {};
    if (DOM.searchInput) DOM.searchInput.value = '';
    saveState();
    renderQuickTags();
    updateUI();
    showToast('🔄', '모든 필터와 검색어가 초기화되었습니다.');
  }

  // Initialization
  function init() {
    renderQuickTags();
    updateUI();
    initEvents();

    // Set first track info in player
    if (MUSIC_CATALOG.length > 0) {
      const first = MUSIC_CATALOG[0];
      DOM.playerThumb.src = first.albumArt;
      DOM.playerTitle.textContent = first.title;
      DOM.playerArtist.textContent = `${first.artist} • ${first.genre}`;
    }
  }

  // Boot
  document.addEventListener('DOMContentLoaded', init);

})();
