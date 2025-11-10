import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

interface Tile {
  letter: string;
  state: LetterState;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function Wordle() {
  const { theme } = useTheme();
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Tile[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const fetchRandomWord = async () => {
    try {
      const { data, error } = await supabase
        .from('wordle_words')
        .select('word')
        .eq('length', WORD_LENGTH);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomWord = data[Math.floor(Math.random() * data.length)].word.toUpperCase();
        setTargetWord(randomWord);
      } else {
        setTargetWord('APPLE');
      }
    } catch (error) {
      console.error('Error fetching word:', error);
      setTargetWord('APPLE');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === '⌫') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      Alert.alert('Invalid Word', 'Please enter a 5-letter word');
      return;
    }

    const guessTiles: Tile[] = [];
    const targetLetters = targetWord.split('');
    const guessLetters = currentGuess.split('');
    const newKeyStates = { ...keyStates };

    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        guessTiles.push({ letter, state: 'correct' });
        newKeyStates[letter] = 'correct';
      } else if (targetLetters.includes(letter)) {
        guessTiles.push({ letter, state: 'present' });
        if (newKeyStates[letter] !== 'correct') {
          newKeyStates[letter] = 'present';
        }
      } else {
        guessTiles.push({ letter, state: 'absent' });
        newKeyStates[letter] = 'absent';
      }
    });

    const newGuesses = [...guesses, guessTiles];
    setGuesses(newGuesses);
    setKeyStates(newKeyStates);

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      setTimeout(() => {
        Alert.alert('Congratulations!', `You won in ${newGuesses.length} ${newGuesses.length === 1 ? 'try' : 'tries'}!`);
      }, 500);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setTimeout(() => {
        Alert.alert('Game Over', `The word was: ${targetWord}`);
      }, 500);
    }

    setCurrentGuess('');
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setKeyStates({});
    setLoading(true);
    fetchRandomWord();
  };

  const getTileColor = (state: LetterState) => {
    switch (state) {
      case 'correct':
        return '#10B981';
      case 'present':
        return '#F59E0B';
      case 'absent':
        return '#4B5563';
      default:
        return theme.colors.cardBackground;
    }
  };

  const getKeyColor = (key: string) => {
    const state = keyStates[key];
    if (state) {
      return getTileColor(state);
    }
    return theme.colors.cardBackground;
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  const emptyRows = MAX_ATTEMPTS - guesses.length - (currentGuess ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.headerBackground }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Wordle</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <RotateCcw size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          {guesses.map((guess, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(i * 100)} style={styles.row}>
              {guess.map((tile, j) => (
                <Animated.View
                  key={j}
                  entering={ZoomIn.delay(j * 100)}
                  style={[styles.tile, { backgroundColor: getTileColor(tile.state) }]}
                >
                  <Text style={styles.tileLetter}>{tile.letter}</Text>
                </Animated.View>
              ))}
            </Animated.View>
          ))}

          {!gameOver && currentGuess && (
            <Animated.View entering={FadeIn} style={styles.row}>
              {currentGuess.split('').map((letter, i) => (
                <View
                  key={i}
                  style={[
                    styles.tile,
                    { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, borderWidth: 2 },
                  ]}
                >
                  <Text style={[styles.tileLetter, { color: theme.colors.text }]}>{letter}</Text>
                </View>
              ))}
              {Array.from({ length: WORD_LENGTH - currentGuess.length }).map((_, i) => (
                <View
                  key={`empty-${i}`}
                  style={[
                    styles.tile,
                    { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, borderWidth: 2 },
                  ]}
                />
              ))}
            </Animated.View>
          )}

          {Array.from({ length: emptyRows }).map((_, i) => (
            <View key={`empty-row-${i}`} style={styles.row}>
              {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                <View
                  key={j}
                  style={[
                    styles.tile,
                    { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.border, borderWidth: 1 },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.keyboard}>
          {KEYBOARD_LAYOUT.map((row, i) => (
            <View key={i} style={styles.keyboardRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.key,
                    key === 'ENTER' || key === '⌫' ? styles.specialKey : null,
                    { backgroundColor: getKeyColor(key) },
                  ]}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.keyText, key === 'ENTER' || key === '⌫' ? styles.specialKeyText : null]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    backButton: {
      padding: 8,
    },
    resetButton: {
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    grid: {
      alignItems: 'center',
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    tile: {
      width: 56,
      height: 56,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    tileLetter: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    keyboard: {
      alignItems: 'center',
    },
    keyboardRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    key: {
      minWidth: 32,
      height: 48,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 3,
      paddingHorizontal: 8,
    },
    specialKey: {
      minWidth: 52,
    },
    keyText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    specialKeyText: {
      fontSize: 12,
    },
  });
