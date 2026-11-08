export type Language = 'ko' | 'en' | 'ja' | 'zh';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appDescription: string;
  moves: string;
  time: string;
  bestRecord: string;
  statusWon: string;
  statusPlaying: string;
  statusPaused: string;
  statusGameOver: string;
  bgm: string;
  sfx: string;
  soundOn: string;
  soundOff: string;
  homeTitle: string;
  currentPlayingMode: string;

  // Title Screen & Streak
  titleHeroSub: string;
  selectModePrompt: string;
  startPlay: string;
  modeStandardDesc: string;
  modeTimeAttackDesc: string;
  modeMoveLimitDesc: string;
  modeDailyDesc: string;
  modeTimeLimitBadge: string;
  modeMoveLimitBadge: string;
  streakDaysSuffix: string;
  streakBadgeText: string;
  chooseThemeAndStart: string;

  // Toolbar & Modes
  imageMode: string;
  numberMode: string;
  themeSelect: string;
  previewHint: string;
  numberHint: string;
  customPhoto: string;
  dailyChallenge: string;
  achievements: string;
  undo: string;
  aiHint: string;
  aiHintCalculating: string;
  aiHintCooldown: string;

  // Actions & Sizes
  newGame: string;
  resetBoard: string;
  autoClear: string;
  sizeEasy: string;
  sizeNormal: string;
  sizeHard: string;

  // Challenge Modes
  modeStandard: string;
  modeTimeAttack: string;
  modeMoveLimit: string;
  timeRemaining: string;
  movesRemaining: string;

  // Win Modal & Stars
  winTitle: string;
  winSubtitle: string;
  newRecord: string;
  totalMoves: string;
  timeElapsed: string;
  starsEarned: string;
  starCriteria3: string;
  starCriteria2: string;
  starCriteria1: string;
  playAgain: string;
  nextLevel: string;
  replayTimelapse: string;
  replayPlay: string;
  replayPause: string;
  replayReset: string;
  shareResult: string;
  downloadCard: string;
  copiedToClipboard: string;

  // Game Over Modal
  gameOverTitle: string;
  gameOverSubtitleTime: string;
  gameOverSubtitleMoves: string;
  tryAgain: string;
  checkSolution: string;

  // Modals & General
  close: string;
  cancel: string;
  apply: string;
  themeModalTitle: string;
  themeModalSubtitle: string;
  hintModalTitle: string;
  hintModalDesc: string;
  cropModalTitle: string;
  cropModalSubtitle: string;
  cropDragPrompt: string;
  cropZoom: string;
  cropUploadBtn: string;
  cropApplyBtn: string;
  dailyModalTitle: string;
  dailyModalSubtitle: string;
  currentStreak: string;
  maxStreak: string;
  achievementsTitle: string;
  achievementsSubtitle: string;
  pwaInstallPrompt: string;
  pwaInstallBtn: string;
  boardControlsGuide: string;

  // Common & Accessibility
  languageSelect: string;
  languageKorean: string;
  languageEnglish: string;
  languageJapanese: string;
  languageChinese: string;
  audioSettings: string;
  bgmTrackSettings: string;
  advancedTools: string;
  secondarySettings: string;
  selected: string;
  completed: string;
  select: string;
  playing: string;
  selectedMuted: string;
  imageTooLarge: string;

  // Title Templates
  timePillTemplate: string;
  movePillTemplate: string;
  timeAttackStartTemplate: string;
  moveLimitStartTemplate: string;
  dailyStartTemplate: string;

  // Header & Units
  movesTotalTitle: string;
  elapsedTimeTitle: string;
  bestRecordTitle: string;
  bestRecordValue: string;
  moveCountValue: string;

  // Win Modal
  starsEarnedLabel: string;
  starsAlt: string;
  replayOpen: string;
  replayStepInfo: string;
  trophyAlt: string;
  playAgainAlt: string;
  nextLevelAlt: string;

  // Game Over
  retryAlt: string;
  solutionAlt: string;

  // Board & Tiles
  tileLabel: string;
  tileMovableLabel: string;
  tileMoveTitle: string;
  aiRecommendedMove: string;
  boardLabel: string;

  // Theme Modal & Theme Metadata
  selectedModeLabel: string;
  themeStart: string;
  hintTitleWithTheme: string;
  themeNatureName: string;
  themeNatureCategory: string;
  themeNatureDescription: string;
  themePixelArtName: string;
  themePixelArtCategory: string;
  themePixelArtDescription: string;
  themeAbstractName: string;
  themeAbstractCategory: string;
  themeAbstractDescription: string;
  themeAnimalName: string;
  themeAnimalCategory: string;
  themeAnimalDescription: string;
  customThemeName: string;
  customThemeCategory: string;
  customThemeDescription: string;

  // Achievements
  achievementProgress: string;
  achievementUnlocked: string;
  achFirstVictoryTitle: string;
  achFirstVictoryDesc: string;
  achSpeedDemonTitle: string;
  achSpeedDemonDesc: string;
  achMasterTacticianTitle: string;
  achMasterTacticianDesc: string;
  achGrandmaster5x5Title: string;
  achGrandmaster5x5Desc: string;
  achStarCollectorTitle: string;
  achStarCollectorDesc: string;
  achPuristNoUndoTitle: string;
  achPuristNoUndoDesc: string;
  achDailyStreak3Title: string;
  achDailyStreak3Desc: string;
  achThemeExplorerTitle: string;
  achThemeExplorerDesc: string;
  achCustomPhotographerTitle: string;
  achCustomPhotographerDesc: string;
  achTimeAttackSurvivorTitle: string;
  achTimeAttackSurvivorDesc: string;
  achMoveLimitMasterTitle: string;
  achMoveLimitMasterDesc: string;
  achPuzzleLegendTitle: string;
  achPuzzleLegendDesc: string;

  // BGM Modal & Metadata
  bgmSettingsTitle: string;
  bgmSettingsSubtitle: string;
  volumeMuteControls: string;
  bgmUnmute: string;
  bgmMute: string;
  sfxUnmute: string;
  sfxMute: string;
  bgmVolumeSlider: string;
  sfxVolumeSlider: string;
  autoThemeBgmTitle: string;
  autoThemeBgmDesc: string;
  bgmPlaylistTitle: string;
  bgmChillGenre: string;
  bgmChillDesc: string;
  bgmZenGenre: string;
  bgmZenDesc: string;
  bgmSynthGenre: string;
  bgmSynthDesc: string;
  bgmJazzGenre: string;
  bgmJazzDesc: string;

  // Daily Modal
  dailyCalendarTitle: string;
  dailyCompletedCount: string;
  dailyDayLabel: string;
  dailyDayCompleted: string;
  dailyDayToday: string;
  dailyTodayCompleted: string;
  dailyTodayStart: string;

  // Share Card
  shareCardSubtitle: string;
  shareCardFooter: string;
  shareCardPlayNow: string;
  shareTitle: string;
  shareText: string;
  difficultyLabel: string;
  themeLabel: string;
  shareCopied: string;
  shareDownloaded: string;
}

export const translations: Record<Language, Translations> = {
  ko: {
    appTitle: 'Sliding Puzzle',
    appDescription: '타일을 밀어 퍼즐을 완성해보세요!',
    moves: '이동 수',
    time: '시간',
    bestRecord: '최고 기록',
    statusWon: '클리어!',
    statusPlaying: '진행 중',
    statusPaused: '일시정지',
    statusGameOver: '게임 오버',
    bgm: 'BGM',
    sfx: 'SFX',
    soundOn: '사운드 켜기',
    soundOff: '음소거',
    homeTitle: '홈으로',
    currentPlayingMode: '현재 모드',

    titleHeroSub: '두뇌를 자극하는 프리미엄 슬라이딩 블록 퍼즐',
    selectModePrompt: '도전할 게임 모드를 선택하세요',
    startPlay: '게임 시작',
    modeStandardDesc: '시간과 이동수 제한 없이 자유롭게 퍼즐을 즐겨보세요.',
    modeTimeAttackDesc: '제한 시간 내에 퍼즐을 완성하는 긴박한 스피드 챌린지!',
    modeMoveLimitDesc: '한 수 한 수 신중하게! 최소 이동수로 클리어하세요.',
    modeDailyDesc: '매일 새로운 시드 퍼즐! 연속 출석 스트릭을 이어가세요.',
    modeTimeLimitBadge: '제한 시간',
    modeMoveLimitBadge: '제한 이동',
    streakDaysSuffix: '일',
    streakBadgeText: '스트릭',
    chooseThemeAndStart: '테마 선택 후 시작',

    imageMode: '이미지 모드',
    numberMode: '숫자 모드',
    themeSelect: '테마 선택',
    previewHint: '미리보기',
    numberHint: '번호 힌트',
    customPhoto: '내 사진',
    dailyChallenge: '일일 챌린지',
    achievements: '업적 도감',
    undo: '되돌리기',
    aiHint: 'AI 힌트',
    aiHintCalculating: '탐색 중...',
    aiHintCooldown: '힌트 대기',

    newGame: '새 게임 (셔플)',
    resetBoard: '정답 보기 (리셋)',
    autoClear: '자동 클리어',
    sizeEasy: '3×3 초급',
    sizeNormal: '4×4 중급',
    sizeHard: '5×5 고급',

    modeStandard: '일반 모드',
    modeTimeAttack: '타임어택',
    modeMoveLimit: '이동 제한',
    timeRemaining: '남은 시간',
    movesRemaining: '남은 이동',

    winTitle: '퍼즐 완성! 축하합니다!',
    winSubtitle: '{size}×{size} 난이도를 멋지게 클리어하셨습니다!',
    newRecord: '신기록 달성! (NEW RECORD)',
    totalMoves: '총 이동 수',
    timeElapsed: '소요 시간',
    starsEarned: '별점 획득',
    starCriteria3: '★★★ 완벽한 수읽기 & 최고 등급 달성!',
    starCriteria2: '★★☆ 훌륭한 클리어 기록!',
    starCriteria1: '★☆☆ 클리어 성공! 다음엔 더 빠르게!',
    playAgain: '다시 플레이',
    nextLevel: '다음 단계 도전',
    replayTimelapse: '풀이 타임랩스',
    replayPlay: '재생',
    replayPause: '일시정지',
    replayReset: '처음으로',
    shareResult: '결과 카드 공유',
    downloadCard: '카드 다운로드',
    copiedToClipboard: '클립보드에 복사되었습니다!',

    gameOverTitle: '게임 오버!',
    gameOverSubtitleTime: '제한 시간이 초과되었습니다.',
    gameOverSubtitleMoves: '이동 가능 횟수를 모두 소진하였습니다.',
    tryAgain: '다시 도전',
    checkSolution: '정답 보기',

    close: '닫기',
    cancel: '취소',
    apply: '적용하기',
    themeModalTitle: '퍼즐 테마 선택',
    themeModalSubtitle: '플레이할 방식과 테마를 선택해 보세요.',
    hintModalTitle: '완성본 미리보기',
    hintModalDesc: '💡 이 이미지를 완성할 수 있도록 타일을 순서대로 맞춰보세요.',
    cropModalTitle: '내 사진으로 퍼즐 만들기',
    cropModalSubtitle: '사진을 업로드하고 1:1 정사각형 영역으로 잘라보세요.',
    cropDragPrompt: '클릭하거나 이미지를 여기로 드래그하세요 (최대 10MB)',
    cropZoom: '확대/축소',
    cropUploadBtn: '다른 사진 선택',
    cropApplyBtn: '퍼즐로 적용하기',
    dailyModalTitle: '오늘의 퍼즐 챌린지',
    dailyModalSubtitle: '매일 새로운 퍼즐을 풀고 연속 출석 스트릭을 이어가세요!',
    currentStreak: '현재 연속 스트릭',
    maxStreak: '최대 연속 스트릭',
    achievementsTitle: '업적 & 트로피 도감',
    achievementsSubtitle: '퍼즐을 풀며 다양한 칭호와 배지를 수집해 보세요.',
    pwaInstallPrompt: '앱으로 설치하여 오프라인에서도 즐겨보세요!',
    pwaInstallBtn: '홈 화면에 설치',
    boardControlsGuide: '💡 마우스 클릭, 터치 스와이프 또는 키보드 방향키(↑↓←→)로 조작할 수 있습니다.',

    languageSelect: '언어 선택',
    languageKorean: '한국어',
    languageEnglish: 'English',
    languageJapanese: '日本語',
    languageChinese: '中文',
    audioSettings: '오디오 설정',
    bgmTrackSettings: 'BGM 트랙 설정',
    advancedTools: '고급 기능 툴바',
    secondarySettings: '보조 설정',
    selected: '선택됨',
    completed: '완료',
    select: '선택',
    playing: '재생 중',
    selectedMuted: '선택됨 (음소거)',
    imageTooLarge: '이미지 파일 크기는 10MB 이하만 가능합니다.',

    timePillTemplate: '{size}×{size} ({seconds}초)',
    movePillTemplate: '{size}×{size} ({moves}회)',
    timeAttackStartTemplate: '{mode} ({seconds}초 도전)',
    moveLimitStartTemplate: '{mode} ({moves}수 도전)',
    dailyStartTemplate: '{mode} 시작하기',

    movesTotalTitle: '총 이동 횟수',
    elapsedTimeTitle: '진행 시간',
    bestRecordTitle: '{size}x{size} 최고 기록',
    bestRecordValue: '{time} / {moves}회',
    moveCountValue: '{count}회',

    starsEarnedLabel: '별점 {stars}개 획득',
    starsAlt: '별점 {stars}성',
    replayOpen: '{count}수 재생',
    replayStepInfo: '{current} / {total} 수',
    trophyAlt: '최고 기록 황금 트로피',
    playAgainAlt: '다시 플레이',
    nextLevelAlt: '다음 도전',

    retryAlt: '다시 시도',
    solutionAlt: '정답 확인',

    tileLabel: '타일 {value}',
    tileMovableLabel: '타일 {value} (이동 가능)',
    tileMoveTitle: '타일 {value} 이동하기',
    aiRecommendedMove: 'AI 추천 이동',
    boardLabel: '{size}x{size} 슬라이딩 퍼즐 보드',

    selectedModeLabel: '선택한 모드:',
    themeStart: '이 테마로 게임 시작',
    hintTitleWithTheme: '완성본 미리보기: {theme}',
    themeNatureName: '자연 & 풍경',
    themeNatureCategory: '풍경',
    themeNatureDescription: '풍부하고 다채로운 색감의 숲과 산 풍경',
    themePixelArtName: '레트로 픽셀',
    themePixelArtCategory: '픽셀아트',
    themePixelArtDescription: '선명한 도트 그래픽의 따뜻한 마을 일러스트',
    themeAbstractName: '기하학 추상',
    themeAbstractCategory: '패턴',
    themeAbstractDescription: '고난도 퍼즐 매니아를 위한 모던 기하학 패턴',
    themeAnimalName: '귀여운 동물',
    themeAnimalCategory: '캐릭터',
    themeAnimalDescription: '사랑스럽고 친근한 동물 캐릭터 일러스트',
    customThemeName: '내 사진 (Custom)',
    customThemeCategory: '사용자 이미지',
    customThemeDescription: '사용자 정의 업로드 이미지',

    achievementProgress: '달성률: {unlocked} / {total} ({percent}%)',
    achievementUnlocked: '🏆 업적 달성! (ACHIEVEMENT UNLOCKED)',
    achFirstVictoryTitle: '첫 승리의 기쁨',
    achFirstVictoryDesc: '어떤 난이도든 처음으로 슬라이딩 퍼즐을 완성하세요.',
    achSpeedDemonTitle: '스피드 데몬',
    achSpeedDemonDesc: '3×3 퍼즐을 30초 이내에 번개처럼 클리어하세요.',
    achMasterTacticianTitle: '전략의 마스터',
    achMasterTacticianDesc: '4×4 퍼즐을 50수 이하의 최소 이동으로 정복하세요.',
    achGrandmaster5x5Title: '5×5 그랜드마스터',
    achGrandmaster5x5Desc: '최고 난이도인 5×5 마스터 퍼즐을 클리어하세요.',
    achStarCollectorTitle: '별들의 수집가',
    achStarCollectorDesc: '만점(3성) 클리어를 누적 3회 달성하세요.',
    achPuristNoUndoTitle: '완벽한 직관 (No Undo)',
    achPuristNoUndoDesc: '되돌리기(Undo)를 단 한 번도 쓰지 않고 클리어하세요.',
    achDailyStreak3Title: '작심삼일 탈출',
    achDailyStreak3Desc: '일일 챌린지를 3일 연속으로 완료하여 스트릭을 달성하세요.',
    achThemeExplorerTitle: '테마 탐험가',
    achThemeExplorerDesc: '4종의 기본 테마(자연, 픽셀, 추상, 동물)로 모두 승리하세요.',
    achCustomPhotographerTitle: '세상에 단 하나뿐인 퍼즐',
    achCustomPhotographerDesc: '내 사진을 직접 업로드하여 만든 퍼즐을 클리어하세요.',
    achTimeAttackSurvivorTitle: '극한의 생존자',
    achTimeAttackSurvivorDesc: '타임어택 하드코어 모드에서 시간 내에 퍼즐을 완성하세요.',
    achMoveLimitMasterTitle: '강철의 의지',
    achMoveLimitMasterDesc: '이동수 제한 하드코어 모드에서 이동수 소진 없이 승리하세요.',
    achPuzzleLegendTitle: '슬라이딩 레전드',
    achPuzzleLegendDesc: '위의 모든 업적을 달성하여 전설의 퍼즐러가 되세요.',

    bgmSettingsTitle: 'BGM & 사운드 설정',
    bgmSettingsSubtitle: '플레이리스트 트랙 선택 및 음량 조절',
    volumeMuteControls: '볼륨 & 음소거 컨트롤',
    bgmUnmute: 'BGM 켜기',
    bgmMute: 'BGM 음소거',
    sfxUnmute: 'SFX 켜기',
    sfxMute: 'SFX 음소거',
    bgmVolumeSlider: 'BGM 볼륨 슬라이더',
    sfxVolumeSlider: 'SFX 볼륨 슬라이더',
    autoThemeBgmTitle: '테마 선택 시 권장 BGM 자동 연동',
    autoThemeBgmDesc: '자연/픽셀/동물 등 테마 분위기에 맞추어 BGM을 자동 전환합니다.',
    bgmPlaylistTitle: '🎵 BGM 트랙 플레이리스트 ({count}곡)',
    bgmChillGenre: '칠홉 / 어쿠스틱',
    bgmChillDesc: '차분하고 편안한 비트와 어쿠스틱 기타 선율',
    bgmZenGenre: '자연 / 앰비언트',
    bgmZenDesc: '맑은 자연의 숨결과 평온한 명상 앰비언스',
    bgmSynthGenre: '신스웨이브 / 일렉트로',
    bgmSynthDesc: '미래적인 신시사이저와 레트로 사이버네틱 리듬',
    bgmJazzGenre: '보사노바 재즈',
    bgmJazzDesc: '세련된 카페 무드의 감미로운 피아노 재즈 선율',

    dailyCalendarTitle: '{year}년 {month}월 출석 현황',
    dailyCompletedCount: '완료 {completed}/{total}일',
    dailyDayLabel: '{day}일',
    dailyDayCompleted: '(클리어 완료)',
    dailyDayToday: '(오늘의 도전)',
    dailyTodayCompleted: '오늘의 퍼즐 완료 (다시 플레이)',
    dailyTodayStart: '오늘의 퍼즐 도전하기',

    shareCardSubtitle: '완벽한 클리어 기록',
    shareCardFooter: '난이도: {size}×{size} | 테마: {theme}',
    shareCardPlayNow: '지금 플레이: 웹 슬라이딩 퍼즐',
    shareTitle: 'Sliding Block Puzzle 승리!',
    shareText: '{size}×{size} 퍼즐을 {moves}수만에 클리어했습니다! 🧩',
    difficultyLabel: '난이도',
    themeLabel: '테마',
    shareCopied: '결과 카드가 클립보드에 복사되었습니다!',
    shareDownloaded: '결과 카드가 이미지 파일로 다운로드되었습니다!',
  },
  en: {
    appTitle: 'Sliding Puzzle',
    appDescription: 'Slide the tiles to complete the puzzle!',
    moves: 'Moves',
    time: 'Time',
    bestRecord: 'Best Record',
    statusWon: 'Cleared!',
    statusPlaying: 'Playing',
    statusPaused: 'Paused',
    statusGameOver: 'Game Over',
    bgm: 'BGM',
    sfx: 'SFX',
    soundOn: 'Sound On',
    soundOff: 'Mute',
    homeTitle: 'Home',
    currentPlayingMode: 'Mode',

    titleHeroSub: 'Brain-boosting sliding block puzzle challenge',
    selectModePrompt: 'Select a game mode to begin',
    startPlay: 'Play Now',
    modeStandardDesc: 'Relax and solve puzzles with no time or move limits.',
    modeTimeAttackDesc: 'Race against the clock in this intense speed challenge!',
    modeMoveLimitDesc: 'Think carefully! Clear the puzzle within limited moves.',
    modeDailyDesc: 'Unique daily puzzle! Keep your daily streak going.',
    modeTimeLimitBadge: 'Time Limit',
    modeMoveLimitBadge: 'Move Limit',
    streakDaysSuffix: 'd',
    streakBadgeText: 'Streak',
    chooseThemeAndStart: 'Select Theme & Play',

    imageMode: 'Image Mode',
    numberMode: 'Number Mode',
    themeSelect: 'Themes',
    previewHint: 'Preview',
    numberHint: 'Numbers',
    customPhoto: 'My Photo',
    dailyChallenge: 'Daily Puzzle',
    achievements: 'Trophies',
    undo: 'Undo',
    aiHint: 'AI Hint',
    aiHintCalculating: 'Solving...',
    aiHintCooldown: 'Hint Ready in',

    newGame: 'New Game',
    resetBoard: 'Reset Board',
    autoClear: 'Auto Clear',
    sizeEasy: '3×3 Easy',
    sizeNormal: '4×4 Medium',
    sizeHard: '5×5 Hard',

    modeStandard: 'Standard',
    modeTimeAttack: 'Time Attack',
    modeMoveLimit: 'Move Limit',
    timeRemaining: 'Time Left',
    movesRemaining: 'Moves Left',

    winTitle: 'Puzzle Solved! Congratulations!',
    winSubtitle: 'You cleared the {size}×{size} puzzle!',
    newRecord: 'NEW RECORD!',
    totalMoves: 'Total Moves',
    timeElapsed: 'Time Elapsed',
    starsEarned: 'Stars',
    starCriteria3: '★★★ Perfect Strategy & Top Tier Clear!',
    starCriteria2: '★★☆ Excellent Clear Performance!',
    starCriteria1: '★☆☆ Solved! Aim higher next time!',
    playAgain: 'Play Again',
    nextLevel: 'Next Difficulty',
    replayTimelapse: 'Replay Timelapse',
    replayPlay: 'Play',
    replayPause: 'Pause',
    replayReset: 'Restart',
    shareResult: 'Share Result Card',
    downloadCard: 'Download Card',
    copiedToClipboard: 'Copied to clipboard!',

    gameOverTitle: 'Game Over!',
    gameOverSubtitleTime: 'Time limit has expired.',
    gameOverSubtitleMoves: 'Out of available moves.',
    tryAgain: 'Try Again',
    checkSolution: 'View Solution',

    close: 'Close',
    cancel: 'Cancel',
    apply: 'Apply',
    themeModalTitle: 'Select Theme',
    themeModalSubtitle: 'Choose a play mode and theme.',
    hintModalTitle: 'Original Preview',
    hintModalDesc: '💡 Slide the tiles to recreate this complete artwork.',
    cropModalTitle: 'Create Custom Puzzle',
    cropModalSubtitle: 'Upload your photo and crop a square 1:1 area.',
    cropDragPrompt: 'Click or drag an image here (Max 10MB)',
    cropZoom: 'Zoom',
    cropUploadBtn: 'Choose Another Image',
    cropApplyBtn: 'Apply to Puzzle',
    dailyModalTitle: 'Daily Puzzle Challenge',
    dailyModalSubtitle: 'Solve today’s puzzle and maintain your daily streak!',
    currentStreak: 'Current Streak',
    maxStreak: 'Best Streak',
    achievementsTitle: 'Achievements & Badges',
    achievementsSubtitle: 'Earn badges and unlock titles as you master puzzles.',
    pwaInstallPrompt: 'Install as app to play offline anytime!',
    pwaInstallBtn: 'Install App',
    boardControlsGuide: '💡 Use click, touch swipe, or arrow keys (↑↓←→) to move tiles.',

    languageSelect: 'Select language',
    languageKorean: 'Korean',
    languageEnglish: 'English',
    languageJapanese: 'Japanese',
    languageChinese: 'Chinese',
    audioSettings: 'Audio settings',
    bgmTrackSettings: 'BGM track settings',
    advancedTools: 'Advanced tools toolbar',
    secondarySettings: 'Secondary settings',
    selected: 'Selected',
    completed: 'Completed',
    select: 'Select',
    playing: 'Playing',
    selectedMuted: 'Selected (Muted)',
    imageTooLarge: 'Image files must be 10MB or smaller.',

    timePillTemplate: '{size}×{size} ({seconds}s)',
    movePillTemplate: '{size}×{size} ({moves} moves)',
    timeAttackStartTemplate: '{mode} ({seconds}s Challenge)',
    moveLimitStartTemplate: '{mode} ({moves} Moves Challenge)',
    dailyStartTemplate: 'Start {mode}',

    movesTotalTitle: 'Total moves',
    elapsedTimeTitle: 'Elapsed time',
    bestRecordTitle: '{size}x{size} best record',
    bestRecordValue: '{time} / {moves} moves',
    moveCountValue: '{count} moves',

    starsEarnedLabel: '{stars} stars earned',
    starsAlt: '{stars}-star rating',
    replayOpen: 'Play {count} moves',
    replayStepInfo: '{current} / {total} moves',
    trophyAlt: 'Golden best-record trophy',
    playAgainAlt: 'Play again',
    nextLevelAlt: 'Next challenge',

    retryAlt: 'Try again',
    solutionAlt: 'View solution',

    tileLabel: 'Tile {value}',
    tileMovableLabel: 'Tile {value} (movable)',
    tileMoveTitle: 'Move tile {value}',
    aiRecommendedMove: 'AI recommended move',
    boardLabel: '{size}x{size} sliding puzzle board',

    selectedModeLabel: 'Selected mode:',
    themeStart: 'Start with This Theme',
    hintTitleWithTheme: 'Original Preview: {theme}',
    themeNatureName: 'Nature & Scenery',
    themeNatureCategory: 'Scenery',
    themeNatureDescription: 'Lush forests and mountains in rich, vibrant colors',
    themePixelArtName: 'Retro Pixel',
    themePixelArtCategory: 'Pixel Art',
    themePixelArtDescription: 'A warm village illustration with crisp pixel graphics',
    themeAbstractName: 'Geometric Abstract',
    themeAbstractCategory: 'Pattern',
    themeAbstractDescription: 'Modern geometric patterns for dedicated puzzle fans',
    themeAnimalName: 'Cute Animals',
    themeAnimalCategory: 'Characters',
    themeAnimalDescription: 'Adorable and friendly animal character illustrations',
    customThemeName: 'My Photo (Custom)',
    customThemeCategory: 'Custom Image',
    customThemeDescription: 'User-uploaded custom image',

    achievementProgress: 'Progress: {unlocked} / {total} ({percent}%)',
    achievementUnlocked: '🏆 Achievement Unlocked!',
    achFirstVictoryTitle: 'Joy of First Victory',
    achFirstVictoryDesc: 'Complete a sliding puzzle for the first time on any difficulty.',
    achSpeedDemonTitle: 'Speed Demon',
    achSpeedDemonDesc: 'Clear a 3×3 puzzle in under 30 seconds.',
    achMasterTacticianTitle: 'Master Tactician',
    achMasterTacticianDesc: 'Conquer a 4×4 puzzle in 50 moves or fewer.',
    achGrandmaster5x5Title: '5×5 Grandmaster',
    achGrandmaster5x5Desc: 'Clear the highest difficulty 5×5 master puzzle.',
    achStarCollectorTitle: 'Star Collector',
    achStarCollectorDesc: 'Earn a perfect 3-star clear 3 times in total.',
    achPuristNoUndoTitle: 'Perfect Instinct (No Undo)',
    achPuristNoUndoDesc: 'Clear without using Undo even once.',
    achDailyStreak3Title: 'Break the Three-Day Curse',
    achDailyStreak3Desc: 'Complete the daily challenge 3 days in a row.',
    achThemeExplorerTitle: 'Theme Explorer',
    achThemeExplorerDesc: 'Win with all four default themes: nature, pixel, abstract, and animal.',
    achCustomPhotographerTitle: 'One-of-a-Kind Puzzle',
    achCustomPhotographerDesc: 'Clear a puzzle made from your own uploaded photo.',
    achTimeAttackSurvivorTitle: 'Extreme Survivor',
    achTimeAttackSurvivorDesc: 'Complete the puzzle within the time limit in Time Attack hardcore mode.',
    achMoveLimitMasterTitle: 'Will of Steel',
    achMoveLimitMasterDesc: 'Win in Move Limit hardcore mode without running out of moves.',
    achPuzzleLegendTitle: 'Sliding Legend',
    achPuzzleLegendDesc: 'Unlock every other achievement to become a legendary puzzler.',

    bgmSettingsTitle: 'BGM & Sound Settings',
    bgmSettingsSubtitle: 'Select a playlist track and adjust the volume',
    volumeMuteControls: 'Volume & Mute Controls',
    bgmUnmute: 'Unmute BGM',
    bgmMute: 'Mute BGM',
    sfxUnmute: 'Unmute SFX',
    sfxMute: 'Mute SFX',
    bgmVolumeSlider: 'BGM volume slider',
    sfxVolumeSlider: 'SFX volume slider',
    autoThemeBgmTitle: 'Auto-sync recommended BGM with theme',
    autoThemeBgmDesc: 'Automatically switches BGM to match nature, pixel, animal, and other theme moods.',
    bgmPlaylistTitle: '🎵 BGM Playlist ({count} tracks)',
    bgmChillGenre: 'Lo-Fi / Acoustic',
    bgmChillDesc: 'Calm, comfortable beats with acoustic guitar melodies',
    bgmZenGenre: 'Nature / Ambient',
    bgmZenDesc: 'Clear natural sounds and serene meditation ambience',
    bgmSynthGenre: 'Synthwave / Electro',
    bgmSynthDesc: 'Futuristic synthesizers with retro cybernetic rhythms',
    bgmJazzGenre: 'Bossa Nova Jazz',
    bgmJazzDesc: 'Refined bossa nova jazz piano with a cozy cafe mood',

    dailyCalendarTitle: 'Attendance in {month}/{year}',
    dailyCompletedCount: '{completed}/{total} days completed',
    dailyDayLabel: 'Day {day}',
    dailyDayCompleted: '(Cleared)',
    dailyDayToday: "(Today's challenge)",
    dailyTodayCompleted: 'Daily puzzle complete (Play again)',
    dailyTodayStart: "Play today's puzzle",

    shareCardSubtitle: 'PERFECT CLEAR RECORD',
    shareCardFooter: 'Difficulty: {size}×{size} | Theme: {theme}',
    shareCardPlayNow: 'Play now: Web Sliding Puzzle',
    shareTitle: 'Sliding Block Puzzle Victory!',
    shareText: 'I cleared a {size}×{size} puzzle in {moves} moves! 🧩',
    difficultyLabel: 'Difficulty',
    themeLabel: 'Theme',
    shareCopied: 'Result card copied to the clipboard!',
    shareDownloaded: 'Result card downloaded as an image file!',
  },
  ja: {
    appTitle: 'スライディングパズル',
    appDescription: 'タイルをスライドさせてパズルを完成させよう！',
    moves: '手数',
    time: 'タイム',
    bestRecord: '最高記録',
    statusWon: 'クリア！',
    statusPlaying: 'プレイ中',
    statusPaused: '一時停止',
    statusGameOver: 'ゲームオーバー',
    bgm: 'BGM',
    sfx: '効果音',
    soundOn: 'サウンドON',
    soundOff: 'ミュート',
    homeTitle: 'ホーム',
    currentPlayingMode: 'プレイモード',

    titleHeroSub: '頭脳を刺激するスライディングブロックパズル',
    selectModePrompt: 'ゲームモードを選択してください',
    startPlay: 'プレイ開始',
    modeStandardDesc: '時間・手数の制限なく自由にパズルを楽しめます。',
    modeTimeAttackDesc: '制限時間内に完成を目指すスピードチャレンジ！',
    modeMoveLimitDesc: '一手を慎重に！決められた手数以内でクリアしよう。',
    modeDailyDesc: '毎日変わるデイリーパズル！連続ストリークを伸ばそう。',
    modeTimeLimitBadge: '制限時間',
    modeMoveLimitBadge: '制限手数',
    streakDaysSuffix: '日',
    streakBadgeText: '連続記録',
    chooseThemeAndStart: 'テーマを選んで開始',

    imageMode: '画像モード',
    numberMode: '数字モード',
    themeSelect: 'テーマ選択',
    previewHint: '見本表示',
    numberHint: '数字ガイド',
    customPhoto: '写真作成',
    dailyChallenge: 'デイリー',
    achievements: '実績図鑑',
    undo: '1手戻す',
    aiHint: 'AIヒント',
    aiHintCalculating: '探索中...',
    aiHintCooldown: 'ヒント待機',

    newGame: '新規ゲーム',
    resetBoard: '正解表示',
    autoClear: '自動クリア',
    sizeEasy: '3×3 初級',
    sizeNormal: '4×4 中級',
    sizeHard: '5×5 上級',

    modeStandard: '通常モード',
    modeTimeAttack: 'タイムアタック',
    modeMoveLimit: '手数制限',
    timeRemaining: '残り時間',
    movesRemaining: '残り手数',

    winTitle: 'パズル完成！おめでとうございます！',
    winSubtitle: '{size}×{size}パズルを見事にクリアしました！',
    newRecord: '新記録達成！ (NEW RECORD)',
    totalMoves: '総手数',
    timeElapsed: '所要時間',
    starsEarned: '獲得スター',
    starCriteria3: '★★★ 完璧な手順＆最高ランク達成！',
    starCriteria2: '★★☆ 素晴らしいクリア記録！',
    starCriteria1: '★☆☆ クリア達成！次はもっと速く！',
    playAgain: 'もう一度遊ぶ',
    nextLevel: '次のレベルへ挑戦',
    replayTimelapse: 'タイムラプス再生',
    replayPlay: '再生',
    replayPause: '一時停止',
    replayReset: '最初から',
    shareResult: '結果カードを共有',
    downloadCard: 'カード保存',
    copiedToClipboard: 'クリップボードにコピーしました！',

    gameOverTitle: 'ゲームオーバー！',
    gameOverSubtitleTime: '制限時間をオーバーしました。',
    gameOverSubtitleMoves: '移動可能手数がなくなりました。',
    tryAgain: '再挑戦',
    checkSolution: '正解を確認',

    close: '閉じる',
    cancel: 'キャンセル',
    apply: '適用する',
    themeModalTitle: 'テーマ選択',
    themeModalSubtitle: 'プレイ方法とテーマを選択してください。',
    hintModalTitle: '完成図プレビュー',
    hintModalDesc: '💡 この完成画像を目指してタイルを動かしてください。',
    cropModalTitle: '自分の写真でパズル作成',
    cropModalSubtitle: '写真をアップロードして1:1の正方形に切り抜きます。',
    cropDragPrompt: 'クリックまたは画像をドラッグしてください（最大10MB）',
    cropZoom: 'ズーム',
    cropUploadBtn: '別の写真を選択',
    cropApplyBtn: 'パズルに適用',
    dailyModalTitle: '本日のデイリーパズル',
    dailyModalSubtitle: '毎日のパズルを解いて連続記録（ストリーク）を伸ばそう！',
    currentStreak: '現在の連続記録',
    maxStreak: '最高連続記録',
    achievementsTitle: '実績＆トロフィー',
    achievementsSubtitle: 'パズルを解いて称号とバッジを集めよう。',
    pwaInstallPrompt: 'アプリとしてインストールしてオフラインでも楽しもう！',
    pwaInstallBtn: 'ホーム画面に追加',
    boardControlsGuide: '💡 クリック、スワイプ、または方向キー(↑↓←→)で操作できます。',

    languageSelect: '言語選択',
    languageKorean: '韓国語',
    languageEnglish: '英語',
    languageJapanese: '日本語',
    languageChinese: '中国語',
    audioSettings: 'オーディオ設定',
    bgmTrackSettings: 'BGMトラック設定',
    advancedTools: '高度な機能ツールバー',
    secondarySettings: '補助設定',
    selected: '選択済み',
    completed: '達成',
    select: '選択',
    playing: '再生中',
    selectedMuted: '選択済み（ミュート）',
    imageTooLarge: '画像ファイルは10MB以下にしてください。',

    timePillTemplate: '{size}×{size}（{seconds}秒）',
    movePillTemplate: '{size}×{size}（{moves}手）',
    timeAttackStartTemplate: '{mode}（{seconds}秒チャレンジ）',
    moveLimitStartTemplate: '{mode}（{moves}手チャレンジ）',
    dailyStartTemplate: '{mode}を開始',

    movesTotalTitle: '総手数',
    elapsedTimeTitle: '経過時間',
    bestRecordTitle: '{size}x{size} 最高記録',
    bestRecordValue: '{time} / {moves}手',
    moveCountValue: '{count}手',

    starsEarnedLabel: '星{stars}個獲得',
    starsAlt: '星{stars}個の評価',
    replayOpen: '{count}手を再生',
    replayStepInfo: '{current} / {total}手',
    trophyAlt: '最高記録の金トロフィー',
    playAgainAlt: 'もう一度プレイ',
    nextLevelAlt: '次の挑戦',

    retryAlt: '再挑戦',
    solutionAlt: '正解確認',

    tileLabel: 'タイル {value}',
    tileMovableLabel: 'タイル {value}（移動可能）',
    tileMoveTitle: 'タイル {value}を移動',
    aiRecommendedMove: 'AIおすすめ移動',
    boardLabel: '{size}x{size} スライディングパズルボード',

    selectedModeLabel: '選択モード:',
    themeStart: 'このテーマでゲーム開始',
    hintTitleWithTheme: '完成図プレビュー: {theme}',
    themeNatureName: '自然＆風景',
    themeNatureCategory: '風景',
    themeNatureDescription: '豊かで多彩な色合いの森と山の風景',
    themePixelArtName: 'レトロピクセル',
    themePixelArtCategory: 'ピクセルアート',
    themePixelArtDescription: '鮮やかなドットグラフィックの温かい街のイラスト',
    themeAbstractName: '幾何学アブストラクト',
    themeAbstractCategory: 'パターン',
    themeAbstractDescription: '上級パズルファン向けのモダンな幾何学模様',
    themeAnimalName: 'かわいい動物',
    themeAnimalCategory: 'キャラクター',
    themeAnimalDescription: '愛らしく親しみやすい動物キャラクターのイラスト',
    customThemeName: 'マイフォト（カスタム）',
    customThemeCategory: 'カスタム画像',
    customThemeDescription: 'ユーザーがアップロードした画像',

    achievementProgress: '達成率: {unlocked} / {total}（{percent}%）',
    achievementUnlocked: '🏆 実績達成！',
    achFirstVictoryTitle: '初勝利の喜び',
    achFirstVictoryDesc: 'どの難易度でも初めてスライディングパズルを完成させよう。',
    achSpeedDemonTitle: 'スピードデーモン',
    achSpeedDemonDesc: '3×3パズルを30秒以内にクリアしよう。',
    achMasterTacticianTitle: '戦略の達人',
    achMasterTacticianDesc: '4×4パズルを50手以内で攻略しよう。',
    achGrandmaster5x5Title: '5×5グランドマスター',
    achGrandmaster5x5Desc: '最高難易度の5×5マスターパズルをクリアしよう。',
    achStarCollectorTitle: '星のコレクター',
    achStarCollectorDesc: '満点（3星）クリアを累計3回達成しよう。',
    achPuristNoUndoTitle: '完璧な直感（No Undo）',
    achPuristNoUndoDesc: '1手戻し（Undo）を一度も使わずにクリアしよう。',
    achDailyStreak3Title: '三日坊主脱出',
    achDailyStreak3Desc: 'デイリーチャレンジを3日連続で達成しよう。',
    achThemeExplorerTitle: 'テーマ探検家',
    achThemeExplorerDesc: '4種類の基本テーマ（自然、ピクセル、抽象、動物）すべてで勝利しよう。',
    achCustomPhotographerTitle: '世界に一つだけのパズル',
    achCustomPhotographerDesc: '自分の写真をアップロードして作ったパズルをクリアしよう。',
    achTimeAttackSurvivorTitle: '極限のサバイバー',
    achTimeAttackSurvivorDesc: 'タイムアタックのハードコアモードで時間内に完成させよう。',
    achMoveLimitMasterTitle: '鋼の意志',
    achMoveLimitMasterDesc: '手数制限ハードコアモードで手数を使い切らずに勝利しよう。',
    achPuzzleLegendTitle: 'スライディングレジェンド',
    achPuzzleLegendDesc: '上記のすべての実績を解除して伝説のパズラーになろう。',

    bgmSettingsTitle: 'BGM＆サウンド設定',
    bgmSettingsSubtitle: 'プレイリストのトラック選択と音量調整',
    volumeMuteControls: '音量＆ミュートコントロール',
    bgmUnmute: 'BGMをオン',
    bgmMute: 'BGMをミュート',
    sfxUnmute: 'SFXをオン',
    sfxMute: 'SFXをミュート',
    bgmVolumeSlider: 'BGM音量スライダー',
    sfxVolumeSlider: 'SFX音量スライダー',
    autoThemeBgmTitle: 'テーマ選択時に推奨BGMを自動連動',
    autoThemeBgmDesc: '自然・ピクセル・動物などのテーマ雰囲気に合わせてBGMを自動切替します。',
    bgmPlaylistTitle: '🎵 BGMトラックプレイリスト（{count}曲）',
    bgmChillGenre: 'ローファイ / アコースティック',
    bgmChillDesc: '落ち着いた心地よいビートとアコースティックギターの旋律',
    bgmZenGenre: '自然 / アンビエント',
    bgmZenDesc: '澄んだ自然の息吹と穏やかな瞑想アンビエンス',
    bgmSynthGenre: 'シンセウェーブ / エレクトロ',
    bgmSynthDesc: '未来的なシンセサイザーとレトロなサイバネティックリズム',
    bgmJazzGenre: 'ボサノヴァジャズ',
    bgmJazzDesc: '洗練されたカフェムードのボサノヴァジャズピアノ',

    dailyCalendarTitle: '{year}年{month}月の出席状況',
    dailyCompletedCount: '達成 {completed}/{total}日',
    dailyDayLabel: '{day}日',
    dailyDayCompleted: '（クリア済み）',
    dailyDayToday: '（今日のチャレンジ）',
    dailyTodayCompleted: '本日のパズル達成（もう一度）',
    dailyTodayStart: '本日のパズルに挑戦',

    shareCardSubtitle: 'パーフェクトクリア記録',
    shareCardFooter: '難易度: {size}×{size} | テーマ: {theme}',
    shareCardPlayNow: '今すぐプレイ: Webスライディングパズル',
    shareTitle: 'Sliding Block Puzzle クリア！',
    shareText: '{size}×{size}パズルを{moves}手でクリアしました！🧩',
    difficultyLabel: '難易度',
    themeLabel: 'テーマ',
    shareCopied: '結果カードをクリップボードにコピーしました！',
    shareDownloaded: '結果カードを画像ファイルとしてダウンロードしました！',
  },
  zh: {
    appTitle: '华容道拼图',
    appDescription: '滑动方块，拼出完整图案！',
    moves: '步数',
    time: '用时',
    bestRecord: '最佳记录',
    statusWon: '通关成功！',
    statusPlaying: '游戏中',
    statusPaused: '暂停',
    statusGameOver: '游戏结束',
    bgm: '音乐',
    sfx: '音效',
    soundOn: '开启声音',
    soundOff: '静音',
    homeTitle: '主页',
    currentPlayingMode: '当前模式',

    titleHeroSub: '锻炼思维的经典滑动方块益智游戏',
    selectModePrompt: '请选择游戏模式开始挑战',
    startPlay: '开始游戏',
    modeStandardDesc: '无时间与步数限制，轻松享受解谜乐趣。',
    modeTimeAttackDesc: '在倒计时结束前复原拼图，极限竞速挑战！',
    modeMoveLimitDesc: '步步为营！在有限的步数内完成拼图。',
    modeDailyDesc: '每日专属随机拼图！保持您的连续打卡记录。',
    modeTimeLimitBadge: '限时',
    modeMoveLimitBadge: '限制步数',
    streakDaysSuffix: '天',
    streakBadgeText: '连续打卡',
    chooseThemeAndStart: '选择主题并开始',

    imageMode: '图片模式',
    numberMode: '数字模式',
    themeSelect: '主题选择',
    previewHint: '预览原图',
    numberHint: '数字提示',
    customPhoto: '自定义照片',
    dailyChallenge: '每日挑战',
    achievements: '成就图鉴',
    undo: '撤销一步',
    aiHint: 'AI提示',
    aiHintCalculating: '计算中...',
    aiHintCooldown: '提示冷却',

    newGame: '新游戏',
    resetBoard: '查看原样',
    autoClear: '自动通关',
    sizeEasy: '3×3 简单',
    sizeNormal: '4×4 普通',
    sizeHard: '5×5 困难',

    modeStandard: '经典模式',
    modeTimeAttack: '限时挑战',
    modeMoveLimit: '步数限制',
    timeRemaining: '剩余时间',
    movesRemaining: '剩余步数',

    winTitle: '拼图完成！恭喜通关！',
    winSubtitle: '您已成功完成 {size}×{size} 拼图！',
    newRecord: '创造新纪录！ (NEW RECORD)',
    totalMoves: '总步数',
    timeElapsed: '总耗时',
    starsEarned: '评级星数',
    starCriteria3: '★★★ 完美策略与顶尖评级！',
    starCriteria2: '★★☆ 优秀通关成绩！',
    starCriteria1: '★☆☆ 通关成功！下次争取更快！',
    playAgain: '再玩一次',
    nextLevel: '挑战下一难度',
    replayTimelapse: '解题过程回放',
    replayPlay: '播放',
    replayPause: '暂停',
    replayReset: '重置',
    shareResult: '分享通关成绩卡',
    downloadCard: '下载成绩卡',
    copiedToClipboard: '已复制到剪贴板！',

    gameOverTitle: '挑战失败！',
    gameOverSubtitleTime: '已超出限定时间。',
    gameOverSubtitleMoves: '已用尽所有步数。',
    tryAgain: '重新挑战',
    checkSolution: '查看答案',

    close: '关闭',
    cancel: '取消',
    apply: '应用',
    themeModalTitle: '拼图主题选择',
    themeModalSubtitle: '请选择游玩方式和主题。',
    hintModalTitle: '原图参考',
    hintModalDesc: '💡 请对照原图，将打乱的图块复原。',
    cropModalTitle: '自选照片拼图',
    cropModalSubtitle: '上传本地照片并裁剪为 1:1 正方形。',
    cropDragPrompt: '点击或拖拽图片至此处上传（最大 10MB）',
    cropZoom: '缩放',
    cropUploadBtn: '更换其他照片',
    cropApplyBtn: '生成拼图',
    dailyModalTitle: '每日拼图挑战',
    dailyModalSubtitle: '每日解题，保持您的连续打卡记录！',
    currentStreak: '当前连续天数',
    maxStreak: '最高连续天数',
    achievementsTitle: '成就与奖章',
    achievementsSubtitle: '在解谜旅程中解锁荣誉称号与勋章。',
    pwaInstallPrompt: '添加至主屏幕，随时离线游玩！',
    pwaInstallBtn: '安装应用',
    boardControlsGuide: '💡 支持鼠标点击、触控滑动或键盘方向键(↑↓←→)控制。',

    languageSelect: '选择语言',
    languageKorean: '韩语',
    languageEnglish: '英语',
    languageJapanese: '日语',
    languageChinese: '中文',
    audioSettings: '音频设置',
    bgmTrackSettings: 'BGM曲目设置',
    advancedTools: '高级功能工具栏',
    secondarySettings: '辅助设置',
    selected: '已选择',
    completed: '已完成',
    select: '选择',
    playing: '播放中',
    selectedMuted: '已选择（静音）',
    imageTooLarge: '图片文件大小不能超过10MB。',

    timePillTemplate: '{size}×{size}（{seconds}秒）',
    movePillTemplate: '{size}×{size}（{moves}步）',
    timeAttackStartTemplate: '{mode}（{seconds}秒挑战）',
    moveLimitStartTemplate: '{mode}（{moves}步挑战）',
    dailyStartTemplate: '开始{mode}',

    movesTotalTitle: '总步数',
    elapsedTimeTitle: '用时',
    bestRecordTitle: '{size}x{size} 最佳记录',
    bestRecordValue: '{time} / {moves}步',
    moveCountValue: '{count}步',

    starsEarnedLabel: '获得{stars}颗星',
    starsAlt: '{stars}星评价',
    replayOpen: '回放{count}步',
    replayStepInfo: '{current} / {total}步',
    trophyAlt: '最高记录金色奖杯',
    playAgainAlt: '再玩一次',
    nextLevelAlt: '下一挑战',

    retryAlt: '重新挑战',
    solutionAlt: '查看答案',

    tileLabel: '方块 {value}',
    tileMovableLabel: '方块 {value}（可移动）',
    tileMoveTitle: '移动方块 {value}',
    aiRecommendedMove: 'AI推荐移动',
    boardLabel: '{size}x{size} 滑动拼图棋盘',

    selectedModeLabel: '已选模式：',
    themeStart: '使用此主题开始游戏',
    hintTitleWithTheme: '原图参考：{theme}',
    themeNatureName: '自然与风景',
    themeNatureCategory: '风景',
    themeNatureDescription: '色彩丰富的森林与山峦风景',
    themePixelArtName: '复古像素',
    themePixelArtCategory: '像素艺术',
    themePixelArtDescription: '清晰点阵风格的温暖小镇插画',
    themeAbstractName: '几何抽象',
    themeAbstractCategory: '图案',
    themeAbstractDescription: '为高阶拼图爱好者打造的现代几何图案',
    themeAnimalName: '可爱动物',
    themeAnimalCategory: '角色',
    themeAnimalDescription: '可爱亲切的动物角色插画',
    customThemeName: '我的照片（自定义）',
    customThemeCategory: '自定义图片',
    customThemeDescription: '用户上传的自定义图片',

    achievementProgress: '完成度：{unlocked} / {total}（{percent}%）',
    achievementUnlocked: '🏆 成就达成！',
    achFirstVictoryTitle: '初胜的喜悦',
    achFirstVictoryDesc: '在任意难度下首次完成滑动拼图。',
    achSpeedDemonTitle: '速度恶魔',
    achSpeedDemonDesc: '在30秒内完成3×3拼图。',
    achMasterTacticianTitle: '战术大师',
    achMasterTacticianDesc: '用50步以内完成4×4拼图。',
    achGrandmaster5x5Title: '5×5宗师',
    achGrandmaster5x5Desc: '完成最高难度的5×5大师拼图。',
    achStarCollectorTitle: '星星收藏家',
    achStarCollectorDesc: '累计3次获得三星满分通关。',
    achPuristNoUndoTitle: '完美直觉（无撤销）',
    achPuristNoUndoDesc: '全程不使用撤销完成拼图。',
    achDailyStreak3Title: '打破三日魔咒',
    achDailyStreak3Desc: '连续3天完成每日挑战。',
    achThemeExplorerTitle: '主题探险家',
    achThemeExplorerDesc: '使用全部四种默认主题（自然、像素、抽象、动物）各获胜一次。',
    achCustomPhotographerTitle: '独一无二的拼图',
    achCustomPhotographerDesc: '完成使用自己上传照片制作的拼图。',
    achTimeAttackSurvivorTitle: '极限生存者',
    achTimeAttackSurvivorDesc: '在限时挑战硬核模式中于时限内完成拼图。',
    achMoveLimitMasterTitle: '钢铁意志',
    achMoveLimitMasterDesc: '在步数限制硬核模式中不耗尽步数获胜。',
    achPuzzleLegendTitle: '滑动传奇',
    achPuzzleLegendDesc: '解锁以上全部成就，成为传奇拼图玩家。',

    bgmSettingsTitle: 'BGM与声音设置',
    bgmSettingsSubtitle: '选择播放列表曲目并调节音量',
    volumeMuteControls: '音量与静音控制',
    bgmUnmute: '开启BGM',
    bgmMute: 'BGM静音',
    sfxUnmute: '开启音效',
    sfxMute: '音效静音',
    bgmVolumeSlider: 'BGM音量滑块',
    sfxVolumeSlider: '音效音量滑块',
    autoThemeBgmTitle: '选择主题时自动联动推荐BGM',
    autoThemeBgmDesc: '根据自然、像素、动物等主题氛围自动切换BGM。',
    bgmPlaylistTitle: '🎵 BGM曲目播放列表（{count}首）',
    bgmChillGenre: '低保真 / 原声',
    bgmChillDesc: '舒缓惬意的节拍与原声吉他旋律',
    bgmZenGenre: '自然 / 氛围',
    bgmZenDesc: '清澈的自然气息与宁静冥想氛围',
    bgmSynthGenre: '合成器浪潮 / 电子',
    bgmSynthDesc: '充满未来感的合成器与复古赛博节奏',
    bgmJazzGenre: '波萨诺瓦爵士',
    bgmJazzDesc: '精致咖啡馆氛围的波萨诺瓦爵士钢琴旋律',

    dailyCalendarTitle: '{year}年{month}月打卡情况',
    dailyCompletedCount: '完成 {completed}/{total}天',
    dailyDayLabel: '第{day}天',
    dailyDayCompleted: '（已通关）',
    dailyDayToday: '（今日挑战）',
    dailyTodayCompleted: '今日拼图已完成（再玩一次）',
    dailyTodayStart: '挑战今日拼图',

    shareCardSubtitle: '完美通关记录',
    shareCardFooter: '难度：{size}×{size} | 主题：{theme}',
    shareCardPlayNow: '立即游玩：网页滑动拼图',
    shareTitle: 'Sliding Block Puzzle 通关！',
    shareText: '我在{moves}步内完成了{size}×{size}拼图！🧩',
    difficultyLabel: '难度',
    themeLabel: '主题',
    shareCopied: '结果卡片已复制到剪贴板！',
    shareDownloaded: '结果卡片已作为图片文件下载！',
  },
};
