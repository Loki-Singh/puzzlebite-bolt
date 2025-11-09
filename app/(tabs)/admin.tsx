import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, ChartBar as BarChart3, Camera, CircleCheck as CheckCircle, Clock, DollarSign } from 'lucide-react-native';

interface ActiveUser {
  id: string;
  name: string;
  tableNumber: string;
  requestTime: string;
  offerRequested: string;
  status: 'pending' | 'approved' | 'completed';
  puzzleCompleted: boolean;
  pbItem?: string;
  pbDiscount?: string;
}

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([
    {
      id: '1',
      name: 'John Doe',
      tableNumber: 'T-05',
      requestTime: '10:30 AM',
      offerRequested: 'Morning Special',
      status: 'pending',
      puzzleCompleted: false,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      tableNumber: 'T-12',
      requestTime: '10:45 AM',
      offerRequested: 'Coffee Combo',
      status: 'approved',
      puzzleCompleted: true,
      pbItem: 'Latte + Croissant',
      pbDiscount: '20%',
    },
  ]);

  const [selectedMenu, setSelectedMenu] = useState('active-users');
  const [blinkState, setBlinkState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveRequest = (userId: string) => {
    setActiveUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'approved', isApproved: true } : user
      )
    );
  };

  const handleUpdatePBItems = (userId: string, item: string, discount: string) => {
    setActiveUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, pbItem: item, pbDiscount: discount } : user
      )
    );
  };

  const renderActiveUsers = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Active Users</Text>
      {activeUsers.map((user) => (
        <View key={user.id} style={[
          styles.userCard,
          user.status === 'pending' && blinkState ? styles.blinkingCard : {}
        ]}>
          <View style={styles.userInfo}>
            <View style={styles.userHeader}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.tableNumber}>
                <Text style={styles.tableNumberText}>{user.tableNumber}</Text>
              </View>
            </View>
            
            <Text style={styles.requestTime}>Request Time: {user.requestTime}</Text>
            <Text style={styles.offerText}>Offer: {user.offerRequested}</Text>
            
            <View style={styles.statusRow}>
              <Text style={[
                styles.statusText,
                { color: user.status === 'pending' ? '#F59E0B' : user.status === 'approved' ? '#3B82F6' : '#10B981' }
              ]}>
                Status: {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Text>
              
              {user.puzzleCompleted && (
                <View style={styles.puzzleCompleted}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.puzzleCompletedText}>Puzzle Done</Text>
                </View>
              )}
            </View>

            {user.status === 'pending' && (
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApproveRequest(user.id)}
              >
                <Text style={styles.approveButtonText}>Approve Request</Text>
              </TouchableOpacity>
            )}

            {user.puzzleCompleted && (
              <View style={styles.pbSection}>
                <Text style={styles.pbTitle}>PuzzleBITE Rewards:</Text>
                <View style={styles.pbInputs}>
                  <TextInput
                    style={styles.pbInput}
                    placeholder="PB Item"
                    value={user.pbItem || ''}
                    onChangeText={(text) => handleUpdatePBItems(user.id, text, user.pbDiscount || '')}
                  />
                  <TextInput
                    style={styles.pbInput}
                    placeholder="PB Discount"
                    value={user.pbDiscount || ''}
                    onChangeText={(text) => handleUpdatePBItems(user.id, user.pbItem || '', text)}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderReports = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Analytics & Reports</Text>
      
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.metricValue}>45</Text>
          <Text style={styles.metricLabel}>Daily Footfall</Text>
        </View>
        
        <View style={styles.metricCard}>
          <DollarSign size={24} color="#10B981" />
          <Text style={styles.metricValue}>78%</Text>
          <Text style={styles.metricLabel}>Conversion Rate</Text>
        </View>
        
        <View style={styles.metricCard}>
          <BarChart3 size={24} color="#F59E0B" />
          <Text style={styles.metricValue}>$1,240</Text>
          <Text style={styles.metricLabel}>Total Discounts</Text>
        </View>
        
        <View style={styles.metricCard}>
          <CheckCircle size={24} color="#8B5CF6" />
          <Text style={styles.metricValue}>92%</Text>
          <Text style={styles.metricLabel}>Puzzle Success</Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Today's Summary</Text>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Active Offers:</Text>
          <Text style={styles.reportValue}>3</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Completed Puzzles:</Text>
          <Text style={styles.reportValue}>28</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportLabel}>Live Feed Likes:</Text>
          <Text style={styles.reportValue}>156</Text>
        </View>
      </View>
    </View>
  );

  const renderLiveFeedManagement = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Live Feed Management</Text>
      <Text style={styles.subtitle}>Upload up to 5 images per day</Text>
      
      <TouchableOpacity style={styles.uploadButton}>
        <Camera size={24} color="#FFFFFF" />
        <Text style={styles.uploadButtonText}>Upload New Image</Text>
      </TouchableOpacity>

      <View style={styles.imageGrid}>
        <View style={styles.imageSlot}>
          <Text style={styles.imageSlotText}>Image 1</Text>
          <Text style={styles.imageSlotSubtext}>Uploaded: 9:30 AM</Text>
        </View>
        <View style={styles.imageSlot}>
          <Text style={styles.imageSlotText}>Image 2</Text>
          <Text style={styles.imageSlotSubtext}>Uploaded: 10:15 AM</Text>
        </View>
        <View style={[styles.imageSlot, styles.emptySlot]}>
          <Text style={styles.emptySlotText}>Empty</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header - Same as customer */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.appLogo}>PuzzleBITE</Text>
          <Text style={styles.adminLabel}>Admin Dashboard</Text>
        </View>
      </View>

      {/* Menu Navigation */}
      <View style={styles.menuNav}>
        <TouchableOpacity
          style={[styles.menuItem, selectedMenu === 'active-users' && styles.activeMenuItem]}
          onPress={() => setSelectedMenu('active-users')}
        >
          <Users size={20} color={selectedMenu === 'active-users' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.menuText, selectedMenu === 'active-users' && styles.activeMenuText]}>
            Active Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, selectedMenu === 'reports' && styles.activeMenuItem]}
          onPress={() => setSelectedMenu('reports')}
        >
          <BarChart3 size={20} color={selectedMenu === 'reports' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.menuText, selectedMenu === 'reports' && styles.activeMenuText]}>
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, selectedMenu === 'live-feed' && styles.activeMenuItem]}
          onPress={() => setSelectedMenu('live-feed')}
        >
          <Camera size={20} color={selectedMenu === 'live-feed' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.menuText, selectedMenu === 'live-feed' && styles.activeMenuText]}>
            Live Feed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedMenu === 'active-users' && renderActiveUsers()}
        {selectedMenu === 'reports' && renderReports()}
        {selectedMenu === 'live-feed' && renderLiveFeedManagement()}
      </ScrollView>
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
  headerCenter: {
    alignItems: 'center',
  },
  appLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  adminLabel: {
    fontSize: 12,
    color: '#A855F7',
    marginTop: 2,
    fontWeight: 'bold',
  },
  menuNav: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeMenuItem: {
    backgroundColor: '#A855F7',
  },
  menuText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeMenuText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D44',
  },
  blinkingCard: {
    backgroundColor: '#2D1B69',
    borderWidth: 2,
    borderColor: '#A855F7',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  tableNumber: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tableNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  requestTime: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  offerText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  puzzleCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzleCompletedText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  pbSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  pbTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  pbInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  pbInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reportLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  reportValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  uploadButton: {
    backgroundColor: '#EA580C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptySlot: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imageSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  imageSlotSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  emptySlotText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});