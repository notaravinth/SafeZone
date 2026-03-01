import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function FileComplaint({ onBack }) {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!description || !date || !location || !agreed) {
      alert('Please fill all required fields and agree to the terms');
      return;
    }
    alert('Complaint filed successfully!\nReference ID: SafeZone-2024-' + Math.floor(Math.random() * 10000));
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
        <Text style={styles.headerTitle}>File a Complaint</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>WOMEN-ONLY</Text>
          <View style={styles.toggleIndicator} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Report an Incident</Text>
          <Text style={styles.subtitle}>
            Your safety and privacy matter. All information is securely stored and encrypted.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* What Happened */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What happened?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the incident in detail..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* When Did It Occur */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>When did it occur?</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateText}>{date || 'Select date and time'}</Text>
              <View style={styles.calendarIcon} />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationRow}>
              <TextInput
                style={styles.locationInput}
                placeholder="Enter location or use GPS"
                placeholderTextColor="#6B7280"
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity style={styles.gpsButton}>
                <View style={styles.gpsIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Proof & Media */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Proof & Media</Text>
            <Text style={styles.helpText}>
              Upload any supporting evidence (optional but recommended)
            </Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton}>
                <View style={styles.photoIcon} />
                <Text style={styles.mediaButtonText}>Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <View style={styles.videoIcon} />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <View style={styles.audioIcon} />
                <Text style={styles.mediaButtonText}>Audio</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmation */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <View style={styles.checkmark} />}
            </View>
            <Text style={styles.checkboxText}>
              I confirm this information is accurate and understand that filing a false report may result in legal consequences.
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>File Complaint</Text>
          </TouchableOpacity>

          {/* Reference ID Info */}
          <View style={styles.referenceInfo}>
            <Text style={styles.referenceText}>
              Reference ID will be generated upon submission
            </Text>
            <Text style={styles.encryptionText}>
              All data is end-to-end encrypted
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
  formSection: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#374151',
  },
  dateInput: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  gpsButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    padding: 16,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  photoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#10B981',
    borderRadius: 8,
    marginBottom: 8,
  },
  videoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    marginBottom: 8,
  },
  audioIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    marginBottom: 8,
  },
  mediaButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6B7280',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  referenceInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  referenceText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  encryptionText: {
    fontSize: 11,
    color: '#4B5563',
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
