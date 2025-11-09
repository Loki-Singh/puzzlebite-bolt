import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MASCOT_PERSONALITIES, MascotType } from '@/lib/mascotTypes';

const MASCOT_STORAGE_KEY = '@mascot_preference';
import { getMascotSVG } from '@/components/mascot/MascotSVGs';
import { useTheme } from '@/contexts/ThemeContext';

export default function MascotSelector() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedMascot, setSelectedMascot] = useState<MascotType>('playful_puppy');
  const [mascotName, setMascotName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPreference, setCurrentPreference] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentPreference();
  }, []);

  const loadCurrentPreference = async () => {
    try {
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem(MASCOT_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setCurrentPreference(data);
          setSelectedMascot(data.selected_mascot as MascotType);
          setMascotName(data.mascot_name || '');
        }
      }
    } catch (error) {
      console.error('Error loading preference:', error);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!mascotName.trim()) {
      setError('Please enter a name for your mascot');
      return;
    }

    setLoading(true);
    try {
      const preference = {
        selected_mascot: selectedMascot,
        mascot_name: mascotName.trim(),
        saved_at: new Date().toISOString(),
      };

      if (Platform.OS === 'web') {
        localStorage.setItem(MASCOT_STORAGE_KEY, JSON.stringify(preference));
      }

      setCurrentPreference(preference);
      setSuccess('Your mascot has been saved!');

      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      console.error('Save mascot error:', error);
      setError(error.message || 'Failed to save mascot');
    } finally {
      setLoading(false);
    }
  };

  const backgroundColor = theme.colors.background;
  const cardBackground = theme.colors.cardBackground;
  const textColor = theme.colors.text;
  const borderColor = theme.colors.border;

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Choose Your Mascot</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Pick a companion to join you on your puzzle adventures!
        </Text>
      </View>

      {error && (
        <View style={[styles.messageBox, styles.errorBox]}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      )}

      {success && (
        <View style={[styles.messageBox, styles.successBox]}>
          <Text style={styles.messageText}>{success}</Text>
        </View>
      )}

      <View style={styles.mascotsGrid}>
        {Object.entries(MASCOT_PERSONALITIES).map(([key, personality]) => {
          const MascotSVG = getMascotSVG(key as MascotType);
          const isSelected = selectedMascot === key;

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.mascotCard,
                { backgroundColor: cardBackground, borderColor },
                isSelected && {
                  borderColor: personality.color,
                  borderWidth: 3,
                },
              ]}
              onPress={() => {
                setSelectedMascot(key as MascotType);
                if (!mascotName) {
                  setMascotName(personality.defaultName);
                }
              }}
            >
              <View style={styles.mascotPreview}>
                <MascotSVG size={80} />
              </View>
              <Text style={[styles.mascotName, { color: textColor }]}>
                {personality.name}
              </Text>
              <Text style={[styles.mascotDescription, { color: textColor }]}>
                {personality.description}
              </Text>
              <View style={styles.reactionsList}>
                <Text style={[styles.reactionText, { color: textColor }]}>
                  Win: {personality.reactions.win}
                </Text>
                <Text style={[styles.reactionText, { color: textColor }]}>
                  Lose: {personality.reactions.lose}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.nameSection}>
        <Text style={[styles.nameLabel, { color: textColor }]}>
          Give Your Mascot a Name
        </Text>
        <TextInput
          style={[
            styles.nameInput,
            { backgroundColor: cardBackground, color: textColor, borderColor },
          ]}
          value={mascotName}
          onChangeText={setMascotName}
          placeholder={MASCOT_PERSONALITIES[selectedMascot].defaultName}
          placeholderTextColor={theme.colors.textSecondary}
          maxLength={20}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: MASCOT_PERSONALITIES[selectedMascot].color },
          loading && styles.saveButtonDisabled,
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Mascot'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.cancelButton, { borderColor }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelButtonText, { color: textColor }]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  messageBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 4,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1F2937',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  mascotsGrid: {
    gap: 16,
  },
  mascotCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 16,
  },
  mascotPreview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  mascotDescription: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  reactionsList: {
    gap: 4,
  },
  reactionText: {
    fontSize: 12,
    opacity: 0.7,
  },
  nameSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  nameLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  nameInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 40,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
