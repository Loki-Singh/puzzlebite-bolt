export type MascotType =
  | 'playful_puppy'
  | 'sarcastic_nerd'
  | 'cool_gamer'
  | 'cheerful_chef';

export type MascotAnimation =
  | 'idle'
  | 'walk'
  | 'win'
  | 'lose'
  | 'tap_screen';

export interface MascotPersonality {
  id: MascotType;
  name: string;
  description: string;
  color: string;
  defaultName: string;
  reactions: {
    win: string;
    lose: string;
    idle: string;
  };
}

export const MASCOT_PERSONALITIES: Record<MascotType, MascotPersonality> = {
  playful_puppy: {
    id: 'playful_puppy',
    name: 'Playful Puppy',
    description: 'Energetic and always excited!',
    color: '#F59E0B',
    defaultName: 'Buddy',
    reactions: {
      win: 'jumps with pure joy',
      lose: 'whimpers adorably',
      idle: 'wags tail impatiently',
    },
  },
  sarcastic_nerd: {
    id: 'sarcastic_nerd',
    name: 'Sarcastic Nerd',
    description: 'Witty and clever, always has a comment',
    color: '#8B5CF6',
    defaultName: 'Newton',
    reactions: {
      win: 'adjusts glasses smugly',
      lose: 'rolls eyes dramatically',
      idle: 'taps foot with arms crossed',
    },
  },
  cool_gamer: {
    id: 'cool_gamer',
    name: 'Cool Gamer',
    description: 'Laid-back and always in the zone',
    color: '#10B981',
    defaultName: 'Pixel',
    reactions: {
      win: 'gives a thumbs up',
      lose: 'shrugs casually',
      idle: 'does a casual hand wave',
    },
  },
  cheerful_chef: {
    id: 'cheerful_chef',
    name: 'Cheerful Chef',
    description: 'Cooking up fun and positivity!',
    color: '#EF4444',
    defaultName: 'Chef Pepper',
    reactions: {
      win: 'tosses pizza dough in celebration',
      lose: 'spills ingredients everywhere',
      idle: 'stirs a pot impatiently',
    },
  },
};
