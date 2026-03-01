import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

export default function SafetyTips({ onBack, womenMode = true, setWomenMode }) {
  const womenTips = [
    {
      id: 1,
      title: 'Walking Alone at Night',
      hazard: 'THE HAZARD',
      hazardDescription: 'Walking alone in poorly lit areas or isolated streets increases vulnerability to harassment or assault.',
      action: 'SAFETY ACTION',
      actionDescription: 'Stick to well-lit main roads, share your location with trusted contacts, carry a personal alarm, and stay aware of your surroundings.',
    },
    {
      id: 2,
      title: 'Accepting Drinks from Strangers',
      hazard: 'THE HAZARD',
      hazardDescription: 'Drinks left unattended or accepted from unknown individuals may be tampered with, leading to serious safety risks.',
      action: 'SAFETY ACTION',
      actionDescription: 'Never leave your drink unattended, decline drinks from strangers, watch your drink being prepared, and use drink covers when available.',
    },
    {
      id: 3,
      title: 'Sharing Personal Information Online',
      hazard: 'THE HAZARD',
      hazardDescription: 'Posting your location, daily routines, or personal details online can make you a target for stalking or harassment.',
      action: 'SAFETY ACTION',
      actionDescription: 'Use strong privacy settings, avoid posting real-time locations, be selective about friend requests, and never share your address publicly.',
    },
    {
      id: 4,
      title: 'Domestic Violence Warning Signs',
      hazard: 'THE HAZARD',
      hazardDescription: 'Controlling behavior, isolation from loved ones, and verbal or physical abuse are serious warning signs that often escalate.',
      action: 'SAFETY ACTION',
      actionDescription: 'Trust your instincts, document incidents, reach out to support services like women helpline (1091), and create a safety plan.',
    },
  ];

  const childTips = [
    {
      id: 1,
      title: 'Talking to Strangers',
      hazard: 'THE HAZARD',
      hazardDescription: 'Children who engage with strangers or accept gifts, rides, or invitations are at high risk of abduction or exploitation.',
      action: 'SAFETY ACTION',
      actionDescription: 'Teach the "No, Go, Yell, Tell" rule. Never accept anything from strangers. Always tell a trusted adult about any uncomfortable interactions.',
    },
    {
      id: 2,
      title: 'Playing Near Busy Roads',
      hazard: 'THE HAZARD',
      hazardDescription: 'Children playing near traffic without supervision can result in serious accidents or injuries from vehicles.',
      action: 'SAFETY ACTION',
      actionDescription: 'Always play in designated safe areas away from traffic. Look both ways before crossing. Follow traffic rules and use crosswalks.',
    },
    {
      id: 3,
      title: 'Cyberbullying and Online Safety',
      hazard: 'THE HAZARD',
      hazardDescription: 'Sharing personal information online or engaging with strangers can lead to cyberbullying, exploitation, or privacy breaches.',
      action: 'SAFETY ACTION',
      actionDescription: 'Never share passwords or personal details. Tell a trusted adult about suspicious messages. Use privacy settings on all accounts.',
    },
    {
      id: 4,
      title: 'Being Left Home Alone',
      hazard: 'THE HAZARD',
      hazardDescription: 'Young children left unsupervised may face emergencies they cannot handle, including fire, injuries, or intruders.',
      action: 'SAFETY ACTION',
      actionDescription: 'Know emergency numbers by heart. Keep doors locked. Never open the door to strangers. Have a list of emergency contacts readily available.',
    },
  ];

  const tips = womenMode ? womenTips : childTips;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onBack}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Center</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>WOMEN-ONLY</Text>
          <Switch
            value={womenMode}
            onValueChange={setWomenMode}
            trackColor={{ false: '#3B82F6', true: '#EC4899' }}
            thumbColor={womenMode ? '#FFFFFF' : '#f4f3f4'}
            style={styles.toggle}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Stay Safe & Informed</Text>
          <Text style={styles.subtitle}>
            Empower yourself with knowledge.{'\n'}
            Understanding common hazards and their solutions is the first step toward a more secure environment for you and your family.
          </Text>
        </View>

        {/* Safety Tips Cards */}
        {tips.map((tip, index) => (
          <View key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.warningIcon} />
              <Text style={styles.tipTitle}>{tip.title}</Text>
            </View>

            <View style={styles.tipSection}>
              <Text style={styles.sectionLabel}>{tip.hazard}</Text>
              <Text style={styles.sectionText}>{tip.hazardDescription}</Text>
            </View>

            <View style={styles.actionSection}>
              <Text style={styles.actionLabel}>{tip.action}</Text>
              <Text style={styles.actionText}>{tip.actionDescription}</Text>
            </View>
          </View>
        ))}
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
  toggle: {
    transform: [{ scale: 0.9 }],
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
  tipCard: {
    backgroundColor: '#2D3748',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  warningIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#EC4899',
    borderRadius: 4,
    marginRight: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EC4899',
  },
  tipSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  actionSection: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#EC4899',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#EC4899',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#D1D5DB',
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
