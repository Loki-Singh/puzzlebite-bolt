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

export type ShapeType = 'triangle' | 'square' | 'circle' | 'hexagon' | 'star' | 'diamond' | 'pentagon' | 'heart';

export const ShapeComponents: Record<ShapeType, React.FC<ShapeProps>> = {
  triangle: Triangle,
  square: Square,
  circle: CircleShape,
  hexagon: Hexagon,
  star: Star,
  diamond: Diamond,
  pentagon: Pentagon,
  heart: Heart,
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
