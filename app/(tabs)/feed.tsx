import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { Heart, Instagram, X, MapPin } from 'lucide-react-native';

interface FeedImage {
  id: string;
  imageUrl: string;
  cafeName: string;
  cafeLocation: string;
  instagramHandle: string;
  likes: number;
  isLiked: boolean;
  uploadTime: string;
  description: string;
}

export default function LiveFeed() {
  const [feedImages, setFeedImages] = useState<FeedImage[]>([
    {
      id: '1',
      imageUrl: 'https://images.pexels.com/photos/1833306/pexels-photo-1833306.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      cafeName: 'Brew & Bite',
      cafeLocation: 'Downtown',
      instagramHandle: '@brewandbite_cafe',
      likes: 24,
      isLiked: false,
      uploadTime: '2 hours ago',
      description: 'Fresh baked croissants with our signature coffee blend',
    },
    {
      id: '2',
      imageUrl: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      cafeName: 'Urban Grind',
      cafeLocation: 'City Center',
      instagramHandle: '@urbangrind_coffee',
      likes: 18,
      isLiked: true,
      uploadTime: '3 hours ago',
      description: 'Artisanal latte art that tells a story',
    },
    {
      id: '3',
      imageUrl: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      cafeName: 'Cozy Corner',
      cafeLocation: 'Old Town',
      instagramHandle: '@cozycorner_cafe',
      likes: 31,
      isLiked: false,
      uploadTime: '4 hours ago',
      description: 'Decadent chocolate cake perfect for your afternoon break',
    },
    {
      id: '4',
      imageUrl: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      cafeName: 'Green Leaf',
      cafeLocation: 'Garden District',
      instagramHandle: '@greenleaf_organic',
      likes: 27,
      isLiked: false,
      uploadTime: '5 hours ago',
      description: 'Healthy avocado toast with organic ingredients',
    },
  ]);

  const [selectedImage, setSelectedImage] = useState<FeedImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % feedImages.length);
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [feedImages.length]);

  const handleLike = (imageId: string) => {
    setFeedImages(prevImages =>
      prevImages.map(image =>
        image.id === imageId
          ? {
              ...image,
              isLiked: !image.isLiked,
              likes: image.isLiked ? image.likes - 1 : image.likes + 1
            }
          : image
      )
    );
  };

  const openImageModal = (image: FeedImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appLogo}>PuzzleBITE</Text>
        <Text style={styles.subtitle}>Live Feed</Text>
      </View>

      {/* Auto-scrolling Hero Section */}
      <View style={styles.heroSection}>
        <TouchableOpacity
          onPress={() => openImageModal(feedImages[currentImageIndex])}
          style={styles.heroImageContainer}
        >
          <Image
            source={{ uri: feedImages[currentImageIndex].imageUrl }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Featured</Text>
            <Text style={styles.heroCafeName}>{feedImages[currentImageIndex].cafeName}</Text>
          </View>
        </TouchableOpacity>
        
        {/* Pagination dots */}
        <View style={styles.paginationDots}>
          {feedImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentImageIndex ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      </View>

      {/* Feed Grid */}
      <ScrollView style={styles.feedContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Latest from Partner Cafes</Text>
        
        <View style={styles.feedGrid}>
          {feedImages.map((image) => (
            <TouchableOpacity
              key={image.id}
              style={styles.feedItem}
              onPress={() => openImageModal(image)}
            >
              <Image source={{ uri: image.imageUrl }} style={styles.feedImage} />
              
              <View style={styles.feedItemOverlay}>
                <View style={styles.cafeInfo}>
                  <Text style={styles.feedCafeName}>{image.cafeName}</Text>
                  <Text style={styles.feedUploadTime}>{image.uploadTime}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLike(image.id)}
                >
                  <Heart
                    size={20}
                    color={image.isLiked ? '#EF4444' : '#FFFFFF'}
                    fill={image.isLiked ? '#EF4444' : 'none'}
                  />
                  <Text style={styles.likeCount}>{image.likes}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Image Detail Modal */}
      <Modal
        visible={selectedImage !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeImageModal}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            {selectedImage && (
              <>
                <Image source={{ uri: selectedImage.imageUrl }} style={styles.modalImage} />
                
                <View style={styles.modalInfo}>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalCafeName}>{selectedImage.cafeName}</Text>
                      <View style={styles.locationRow}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.modalLocation}>{selectedImage.cafeLocation}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.modalLikeButton}
                      onPress={() => {
                        handleLike(selectedImage.id);
                        setSelectedImage(prev => prev ? {
                          ...prev,
                          isLiked: !prev.isLiked,
                          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
                        } : null);
                      }}
                    >
                      <Heart
                        size={24}
                        color={selectedImage.isLiked ? '#EF4444' : '#6B7280'}
                        fill={selectedImage.isLiked ? '#EF4444' : 'none'}
                      />
                      <Text style={styles.modalLikeCount}>{selectedImage.likes}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.modalDescription}>{selectedImage.description}</Text>
                  
                  <TouchableOpacity style={styles.instagramButton}>
                    <Instagram size={20} color="#E4405F" />
                    <Text style={styles.instagramText}>{selectedImage.instagramHandle}</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.modalUploadTime}>Posted {selectedImage.uploadTime}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A2E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingTop: 60,
  },
  appLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#A855F7',
    marginTop: 2,
    fontWeight: 'bold',
  },
  heroSection: {
    backgroundColor: '#1A1A2E',
    paddingBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
  },
  heroImageContainer: {
    position: 'relative',
    height: 200,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroCafeName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
  feedContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  feedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feedItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedImage: {
    width: '100%',
    height: 120,
  },
  feedItemOverlay: {
    padding: 12,
  },
  cafeInfo: {
    marginBottom: 8,
  },
  feedCafeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  feedUploadTime: {
    fontSize: 12,
    color: '#64748B',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  likeCount: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 20,
    maxHeight: '90%',
    width: '90%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalInfo: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalCafeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  modalLocation: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  modalLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLikeCount: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 6,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 16,
  },
  instagramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  instagramText: {
    fontSize: 14,
    color: '#E4405F',
    marginLeft: 6,
    fontWeight: '600',
  },
  modalUploadTime: {
    fontSize: 12,
    color: '#64748B',
  },
});