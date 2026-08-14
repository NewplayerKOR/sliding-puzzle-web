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
    winSubtitle: '난이도를 멋지게 클리어하셨습니다!',
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
    themeModalSubtitle: '플레이하고 싶은 이미지 테마를 선택해 보세요.',
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
    winSubtitle: 'You have conquered this puzzle!',
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
    themeModalSubtitle: 'Choose an image theme to play.',
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
    winSubtitle: '見事にパズルをクリアしました！',
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
    themeModalSubtitle: 'お好みの画像テーマを選んでください。',
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
    winSubtitle: '您已成功解开本关卡！',
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
    themeModalSubtitle: '选择您心仪的图片主题。',
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
  },
};
