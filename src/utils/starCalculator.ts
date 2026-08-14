import { GameChallengeMode, GridSize } from '../types/puzzle';

export interface StarCalculationParams {
  gridSize: GridSize;
  challengeMode: GameChallengeMode;
  moveCount: number;
  elapsedTime: number;
}

export interface StarRatingResult {
  stars: number;
  feedbackKey: 'starCriteria3' | 'starCriteria2' | 'starCriteria1';
  summary: string;
}

export function calculateStars(params: StarCalculationParams): StarRatingResult {
  const { gridSize, challengeMode, moveCount, elapsedTime } = params;

  let stars = 1;

  if (challengeMode === 'timeAttack') {
    // Time Attack Mode: Evaluated primarily by speed against time limit
    if (gridSize === 3) {
      if (elapsedTime <= 25) stars = 3;
      else if (elapsedTime <= 38) stars = 2;
      else stars = 1;
    } else if (gridSize === 4) {
      if (elapsedTime <= 60) stars = 3;
      else if (elapsedTime <= 95) stars = 2;
      else stars = 1;
    } else {
      // 5x5
      if (elapsedTime <= 150) stars = 3;
      else if (elapsedTime <= 240) stars = 2;
      else stars = 1;
    }
  } else if (challengeMode === 'moveLimit') {
    // Move Limit Mode: Evaluated primarily by move efficiency against move limit
    if (gridSize === 3) {
      if (moveCount <= 22) stars = 3;
      else if (moveCount <= 30) stars = 2;
      else stars = 1;
    } else if (gridSize === 4) {
      if (moveCount <= 50) stars = 3;
      else if (moveCount <= 70) stars = 2;
      else stars = 1;
    } else {
      // 5x5
      if (moveCount <= 140) stars = 3;
      else if (moveCount <= 195) stars = 2;
      else stars = 1;
    }
  } else {
    // Standard Mode: Hybrid threshold (relaxed time criteria when moves are exceptional)
    if (gridSize === 3) {
      if ((moveCount <= 35 && elapsedTime <= 60) || moveCount <= 25) stars = 3;
      else if ((moveCount <= 60 && elapsedTime <= 120) || moveCount <= 45) stars = 2;
      else stars = 1;
    } else if (gridSize === 4) {
      if ((moveCount <= 80 && elapsedTime <= 150) || moveCount <= 55) stars = 3;
      else if ((moveCount <= 140 && elapsedTime <= 300) || moveCount <= 95) stars = 2;
      else stars = 1;
    } else {
      // 5x5
      if ((moveCount <= 180 && elapsedTime <= 360) || moveCount <= 130) stars = 3;
      else if ((moveCount <= 300 && elapsedTime <= 600) || moveCount <= 200) stars = 2;
      else stars = 1;
    }
  }

  const feedbackKey =
    stars === 3
      ? 'starCriteria3'
      : stars === 2
      ? 'starCriteria2'
      : 'starCriteria1';

  return {
    stars,
    feedbackKey,
    summary: `${stars}성 달성`,
  };
}
