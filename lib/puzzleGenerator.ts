import { ShapeType } from '@/components/puzzle/PuzzleShapes';

export interface PuzzleSlot {
  id: number;
  shapeType: ShapeType;
  row: number;
  col: number;
  filled: boolean;
}

export interface PuzzleShape {
  id: number;
  shapeType: ShapeType;
  number: number;
  color: string;
  used: boolean;
}

export interface PuzzleFormation {
  slots: PuzzleSlot[];
  shapes: PuzzleShape[];
  correctSequence: number[];
  rows: number;
  cols: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const shapeTypes: ShapeType[] = ['triangle', 'square', 'circle', 'hexagon', 'star', 'diamond', 'pentagon', 'heart'];
const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#F97316', '#84CC16'];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateEasyFormation(): PuzzleFormation {
  const rows = 2;
  const cols = 2;
  const numShapes = 4;

  const selectedShapes = shuffleArray(shapeTypes).slice(0, numShapes);
  const selectedColors = shuffleArray(colors).slice(0, numShapes);

  const slots: PuzzleSlot[] = [];
  const shapes: PuzzleShape[] = [];
  const correctSequence: number[] = [];

  let slotId = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const shapeType = selectedShapes[slotId];
      slots.push({
        id: slotId,
        shapeType,
        row,
        col,
        filled: false,
      });

      shapes.push({
        id: slotId,
        shapeType,
        number: slotId + 1,
        color: selectedColors[slotId],
        used: false,
      });

      correctSequence.push(slotId);
      slotId++;
    }
  }

  return {
    slots,
    shapes: shuffleArray(shapes),
    correctSequence,
    rows,
    cols,
    difficulty: 'easy',
  };
}

function generateMediumFormation(): PuzzleFormation {
  const rows = 3;
  const cols = 2;
  const numShapes = 6;

  const selectedShapes = shuffleArray(shapeTypes).slice(0, numShapes);
  const selectedColors = shuffleArray(colors).slice(0, numShapes);

  const slots: PuzzleSlot[] = [];
  const shapes: PuzzleShape[] = [];
  const correctSequence: number[] = [];

  let slotId = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const shapeType = selectedShapes[slotId];
      slots.push({
        id: slotId,
        shapeType,
        row,
        col,
        filled: false,
      });

      shapes.push({
        id: slotId,
        shapeType,
        number: slotId + 1,
        color: selectedColors[slotId],
        used: false,
      });

      correctSequence.push(slotId);
      slotId++;
    }
  }

  return {
    slots,
    shapes: shuffleArray(shapes),
    correctSequence,
    rows,
    cols,
    difficulty: 'medium',
  };
}

function generateHardFormation(): PuzzleFormation {
  const rows = 3;
  const cols = 3;
  const numShapes = 8;

  const selectedShapes = shuffleArray(shapeTypes);
  const selectedColors = shuffleArray(colors);

  const slots: PuzzleSlot[] = [];
  const shapes: PuzzleShape[] = [];
  const correctSequence: number[] = [];

  const positions = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 0, col: 2 },
  ];

  positions.forEach((pos, index) => {
    const shapeType = selectedShapes[index];
    slots.push({
      id: index,
      shapeType,
      row: pos.row,
      col: pos.col,
      filled: false,
    });

    shapes.push({
      id: index,
      shapeType,
      number: index + 1,
      color: selectedColors[index],
      used: false,
    });

    correctSequence.push(index);
  });

  return {
    slots,
    shapes: shuffleArray(shapes),
    correctSequence,
    rows,
    cols,
    difficulty: 'hard',
  };
}

export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'easy'): PuzzleFormation {
  switch (difficulty) {
    case 'easy':
      return generateEasyFormation();
    case 'medium':
      return generateMediumFormation();
    case 'hard':
      return generateHardFormation();
    default:
      return generateEasyFormation();
  }
}
