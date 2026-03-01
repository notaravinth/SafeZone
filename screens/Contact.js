import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';

export default function Contact({ onBack }) {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onBack}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact & Support</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>WOMEN-ONLY</Text>
          <View style={styles.toggleIndicator} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>We're Here to Help</Text>
          <Text style={styles.subtitle}>
            Reach out to us anytime. Our support team is available 24/7 for urgent matters.
          </Text>
        </View>

        {/* Emergency Hotlines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('100')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#EF4444' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Police Emergency</Text>
              <Text style={styles.contactNumber}>100</Text>
            </View>
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>CALL</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('1091')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#EC4899' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Women Helpline</Text>
              <Text style={styles.contactNumber}>1091</Text>
            </View>
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>CALL</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('1098')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#F59E0B' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Child Helpline</Text>
              <Text style={styles.contactNumber}>1098</Text>
            </View>
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>CALL</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('108')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#10B981' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Ambulance</Text>
              <Text style={styles.contactNumber}>108</Text>
            </View>
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>CALL</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SafeZone Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SafeZone Support</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={() => handleEmail('support@safezone.app')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#3B82F6' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDetail}>support@safezone.app</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('+911234567890')}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: '#8B5CF6' }]} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Support Helpline</Text>
              <Text style={styles.contactDetail}>+91 123 456 7890</Text>
            </View>
            <View style={styles.callButton}>
              <Text style={styles.callButtonText}>CALL</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Office Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Office Address</Text>
          <View style={styles.addressCard}>
            <Text style={styles.addressTitle}>SafeZone Headquarters</Text>
            <Text style={styles.addressText}>
              123 Safety Street{'\n'}
              Tech Park, Sector 5{'\n'}
              Bangalore, Karnataka 560001{'\n'}
              India
            </Text>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>How does the emergency alert work?</Text>
            <Text style={styles.faqAnswer}>
              When you activate an emergency alert, your location is shared with emergency contacts and relevant authorities immediately.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>
              Yes, all your personal information and emergency contacts are stored locally on your device with end-to-end encryption.
            </Text>
          </View>

          <View style={styles.faqCard}>
            <Text style={styles.faqQuestion}>Can I use the app offline?</Text>
            <Text style={styles.faqAnswer}>
              Core emergency features like calling emergency numbers work offline. Location sharing requires an internet connection.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.navIconInactive} />
          <Text style={styles.navLabel}>EXPLORE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.navButtonActive]} onPress={onBack}>
          <View style={styles.navIconHome} />
          <Text style={styles.navLabelActive}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <View style={styles.navIconInactive} />
          <Text style={styles.navLabel}>SAFETY TIPS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D2E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1A1D2E',
  },
  menuButton: {
    padding: 8,
    justifyContent: 'space-between',
    height: 24,
    width: 28,
  },
  hamburgerLine: {
    width: 28,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleLabel: {
    fontSize: 11,
    color: '#EC4899',
    fontWeight: 'bold',
    marginRight: 8,
  },
  toggleIndicator: {
    width: 32,
    height: 18,
    backgroundColor: '#EC4899',
    borderRadius: 9,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EC4899',
  },
  contactDetail: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  callButton: {
    backgroundColor: '#EC4899',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addressCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  faqCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#1A1D2E',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  navButtonActive: {
    opacity: 1,
  },
  navIconInactive: {
    width: 24,
    height: 24,
    backgroundColor: '#6B7280',
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconHome: {
    width: 24,
    height: 24,
    backgroundColor: '#EC4899',
    borderRadius: 4,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  navLabelActive: {
    fontSize: 10,
    color: '#EC4899',
    fontWeight: '600',
  },
});
