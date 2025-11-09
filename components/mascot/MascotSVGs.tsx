import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
import { MascotType } from '@/lib/mascotTypes';

interface MascotSVGProps {
  size?: number;
  animation?: 'idle' | 'walk' | 'win' | 'lose' | 'tap_screen';
}

export const PlayfulPuppySVG: React.FC<MascotSVGProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="20" fill="#F59E0B" />
      <Ellipse cx="45" cy="35" rx="8" ry="12" fill="#F59E0B" />
      <Ellipse cx="55" cy="35" rx="8" ry="12" fill="#F59E0B" />
      <Circle cx="45" cy="48" r="3" fill="#1F2937" />
      <Circle cx="55" cy="48" r="3" fill="#1F2937" />
      <Path d="M 45 55 Q 50 58 55 55" stroke="#1F2937" strokeWidth="2" fill="none" />
      <Circle cx="50" cy="53" r="2" fill="#1F2937" />
      <Ellipse cx="30" cy="65" rx="8" ry="15" fill="#F59E0B" />
      <Ellipse cx="70" cy="65" rx="8" ry="15" fill="#F59E0B" />
      <Path d="M 50 70 Q 45 75 40 72" stroke="#F59E0B" strokeWidth="4" fill="none" />
    </Svg>
  );
};

export const SarcasticNerdSVG: React.FC<MascotSVGProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="22" fill="#8B5CF6" />
      <Rect x="35" y="45" width="12" height="10" rx="2" fill="none" stroke="#1F2937" strokeWidth="2" />
      <Rect x="53" y="45" width="12" height="10" rx="2" fill="none" stroke="#1F2937" strokeWidth="2" />
      <Path d="M 47 45 L 53 45" stroke="#1F2937" strokeWidth="2" />
      <Circle cx="41" cy="50" r="2" fill="#1F2937" />
      <Circle cx="59" cy="50" r="2" fill="#1F2937" />
      <Path d="M 43 60 L 57 60" stroke="#1F2937" strokeWidth="2" />
      <Path d="M 35 40 Q 38 35 42 38" stroke="#8B5CF6" strokeWidth="3" fill="none" />
      <Path d="M 50 30 Q 55 25 58 28" stroke="#8B5CF6" strokeWidth="3" fill="none" />
      <Rect x="48" y="70" width="4" height="8" fill="#8B5CF6" />
    </Svg>
  );
};

export const CoolGamerSVG: React.FC<MascotSVGProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="22" fill="#10B981" />
      <Rect x="35" y="44" width="15" height="8" rx="2" fill="#1F2937" />
      <Rect x="50" y="44" width="15" height="8" rx="2" fill="#1F2937" />
      <Path d="M 40 58 Q 50 62 60 58" stroke="#1F2937" strokeWidth="2" fill="none" />
      <Path d="M 30 40 Q 35 35 40 38" stroke="#10B981" strokeWidth="3" fill="none" />
      <Path d="M 60 38 Q 65 35 70 40" stroke="#10B981" strokeWidth="3" fill="none" />
      <Circle cx="50" cy="32" r="4" fill="#10B981" />
      <Path d="M 45 30 L 40 28" stroke="#1F2937" strokeWidth="2" />
      <Path d="M 55 30 L 60 28" stroke="#1F2937" strokeWidth="2" />
    </Svg>
  );
};

export const CheerfulChefSVG: React.FC<MascotSVGProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="55" r="20" fill="#EF4444" />
      <Rect x="40" y="28" width="20" height="12" rx="2" fill="#FFFFFF" />
      <Ellipse cx="50" cy="26" rx="12" ry="8" fill="#FFFFFF" />
      <Circle cx="44" cy="52" r="3" fill="#1F2937" />
      <Circle cx="56" cy="52" r="3" fill="#1F2937" />
      <Path d="M 43 60 Q 50 65 57 60" stroke="#1F2937" strokeWidth="2" fill="none" />
      <Circle cx="50" cy="58" r="2" fill="#1F2937" />
      <Circle cx="40" cy="50" r="4" fill="#FCA5A5" />
      <Circle cx="60" cy="50" r="4" fill="#FCA5A5" />
      <Path d="M 35 70 L 38 75 L 32 76" stroke="#EF4444" strokeWidth="3" fill="none" />
      <Path d="M 65 70 L 62 75 L 68 76" stroke="#EF4444" strokeWidth="3" fill="none" />
    </Svg>
  );
};

export const getMascotSVG = (type: MascotType): React.FC<MascotSVGProps> => {
  switch (type) {
    case 'playful_puppy':
      return PlayfulPuppySVG;
    case 'sarcastic_nerd':
      return SarcasticNerdSVG;
    case 'cool_gamer':
      return CoolGamerSVG;
    case 'cheerful_chef':
      return CheerfulChefSVG;
    default:
      return PlayfulPuppySVG;
  }
};
