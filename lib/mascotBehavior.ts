import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface Position {
  x: number;
  y: number;
}

export interface WalkingState {
  position: Position;
  targetPosition: Position;
  isWalking: boolean;
  direction: 'left' | 'right';
}

const MASCOT_SIZE = 80;
const MARGIN = 20;
const MIN_X = MARGIN;
const MAX_X = SCREEN_WIDTH - MASCOT_SIZE - MARGIN;
const MIN_Y = MARGIN + 100;
const MAX_Y = SCREEN_HEIGHT - MASCOT_SIZE - MARGIN - 100;

export const generateRandomTarget = (currentPosition: Position): Position => {
  const newX = Math.random() * (MAX_X - MIN_X) + MIN_X;
  const newY = Math.random() * (MAX_Y - MIN_Y) + MIN_Y;

  return { x: newX, y: newY };
};

export const calculateDirection = (
  current: Position,
  target: Position
): 'left' | 'right' => {
  return target.x > current.x ? 'right' : 'left';
};

export const hasReachedTarget = (
  current: Position,
  target: Position,
  threshold: number = 10
): boolean => {
  const distance = Math.sqrt(
    Math.pow(target.x - current.x, 2) + Math.pow(target.y - current.y, 2)
  );
  return distance < threshold;
};

export const getInitialPosition = (): Position => {
  return {
    x: SCREEN_WIDTH / 2 - MASCOT_SIZE / 2,
    y: SCREEN_HEIGHT / 2 - MASCOT_SIZE / 2,
  };
};

export const WALK_SPEED = 0.5;
export const IDLE_DURATION = 3000;
export const WALK_DURATION_MIN = 2000;
export const WALK_DURATION_MAX = 5000;

export const getRandomWalkDuration = (): number => {
  return (
    Math.random() * (WALK_DURATION_MAX - WALK_DURATION_MIN) +
    WALK_DURATION_MIN
  );
};

export const getRandomIdleDuration = (): number => {
  return IDLE_DURATION + Math.random() * 2000;
};
