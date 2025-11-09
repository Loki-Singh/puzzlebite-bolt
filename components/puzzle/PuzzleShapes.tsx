import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Polygon, G } from 'react-native-svg';

export interface ShapeProps {
  size?: number;
  color: string;
  number?: number;
}

export const Triangle: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Polygon
      points="30,5 55,50 5,50"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Square: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M10 10 L50 10 L50 50 L10 50 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const CircleShape: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Circle
      cx="30"
      cy="30"
      r="22"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Hexagon: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Polygon
      points="30,5 50,17.5 50,42.5 30,55 10,42.5 10,17.5"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Star: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M30 5 L37 22 L55 22 L41 33 L47 50 L30 39 L13 50 L19 33 L5 22 L23 22 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Diamond: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Polygon
      points="30,5 50,30 30,55 10,30"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Pentagon: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Polygon
      points="30,5 55,22 45,50 15,50 5,22"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Heart: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M30,50 C30,50 5,35 5,20 C5,10 12,5 18,5 C24,5 28,9 30,13 C32,9 36,5 42,5 C48,5 55,10 55,20 C55,35 30,50 30,50 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Moon: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M35,5 C35,20 25,30 15,30 C10,30 5,28 5,28 C8,45 22,55 38,55 C50,55 55,45 55,35 C55,20 45,5 35,5 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Leaf: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M30,55 Q30,30 10,10 Q30,15 50,10 Q30,30 30,55 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Lightning: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M35,5 L20,30 L30,30 L25,55 L45,25 L35,25 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Cloud: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M15,35 C8,35 5,30 5,25 C5,20 8,15 15,15 C15,10 20,5 28,5 C35,5 40,10 42,15 C48,15 55,20 55,28 C55,35 50,40 42,40 L15,40 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
  </Svg>
);

export const Flower: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <G>
      <Circle cx="30" cy="15" r="8" fill={color} stroke="#000" strokeWidth="2" />
      <Circle cx="45" cy="30" r="8" fill={color} stroke="#000" strokeWidth="2" />
      <Circle cx="30" cy="45" r="8" fill={color} stroke="#000" strokeWidth="2" />
      <Circle cx="15" cy="30" r="8" fill={color} stroke="#000" strokeWidth="2" />
      <Circle cx="30" cy="30" r="6" fill="#FFD700" stroke="#000" strokeWidth="2" />
    </G>
  </Svg>
);

export const Butterfly: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <G>
      <Path
        d="M28,10 Q18,15 15,25 Q12,35 18,40 Q25,45 28,30 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2"
      />
      <Path
        d="M32,10 Q42,15 45,25 Q48,35 42,40 Q35,45 32,30 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2"
      />
      <Path
        d="M30,8 L30,50"
        stroke="#000"
        strokeWidth="2"
        fill="none"
      />
    </G>
  </Svg>
);

export const Pizza: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <Path
      d="M30,10 L50,50 Q40,52 30,52 Q20,52 10,50 Z"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
    <Circle cx="30" cy="35" r="3" fill="#FF0000" />
    <Circle cx="25" cy="42" r="3" fill="#FF0000" />
    <Circle cx="35" cy="42" r="3" fill="#FF0000" />
  </Svg>
);

export const Rocket: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <G>
      <Path
        d="M30,5 L38,35 L30,30 L22,35 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2"
      />
      <Path d="M22,35 L15,50 L22,42 Z" fill="#FF4444" stroke="#000" strokeWidth="2" />
      <Path d="M38,35 L45,50 L38,42 Z" fill="#FF4444" stroke="#000" strokeWidth="2" />
      <Circle cx="30" cy="20" r="4" fill="#FFF" stroke="#000" strokeWidth="1" />
    </G>
  </Svg>
);

export const Candy: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <G>
      <Path
        d="M15,25 L20,20 L40,20 L45,25 L45,35 L40,40 L20,40 L15,35 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2"
      />
      <Path d="M10,30 L15,25 L15,35 L10,30 Z" fill="#FF6B6B" stroke="#000" strokeWidth="2" />
      <Path d="M50,30 L45,25 L45,35 L50,30 Z" fill="#FF6B6B" stroke="#000" strokeWidth="2" />
    </G>
  </Svg>
);

export const Umbrella: React.FC<ShapeProps> = ({ size = 60, color }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60">
    <G>
      <Path
        d="M30,10 Q10,10 8,25 L30,25 L52,25 Q50,10 30,10 Z"
        fill={color}
        stroke="#000"
        strokeWidth="2"
      />
      <Path d="M30,25 L30,50 Q30,55 25,55" stroke="#000" strokeWidth="2" fill="none" />
    </G>
  </Svg>
);

export type ShapeType = 'triangle' | 'square' | 'circle' | 'hexagon' | 'star' | 'diamond' | 'pentagon' | 'heart' | 'moon' | 'leaf' | 'lightning' | 'cloud' | 'flower' | 'butterfly' | 'pizza' | 'rocket' | 'candy' | 'umbrella';

export const ShapeComponents: Record<ShapeType, React.FC<ShapeProps>> = {
  triangle: Triangle,
  square: Square,
  circle: CircleShape,
  hexagon: Hexagon,
  star: Star,
  diamond: Diamond,
  pentagon: Pentagon,
  heart: Heart,
  moon: Moon,
  leaf: Leaf,
  lightning: Lightning,
  cloud: Cloud,
  flower: Flower,
  butterfly: Butterfly,
  pizza: Pizza,
  rocket: Rocket,
  candy: Candy,
  umbrella: Umbrella,
};

export const ShapeColors = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#A855F7',
  pink: '#EC4899',
  orange: '#F97316',
  cyan: '#06B6D4',
  indigo: '#6366F1',
  lime: '#84CC16',
};
