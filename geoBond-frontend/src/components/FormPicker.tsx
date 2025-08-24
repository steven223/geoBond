import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PickerOption {
  label: string;
  value: string;
}

interface FormPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  required?: boolean;
}

const FormPicker: React.FC<FormPickerProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
  icon,
  error,
  required = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: PickerOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === value && styles.selectedOption,
      ]}
      onPress={() => handleSelect(item.value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.optionText,
        item.value === value && styles.selectedOptionText,
      ]}>
        {item.label}
      </Text>
      {item.value === value && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.pickerContainer,
          error && styles.pickerError,
        ]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={error ? '#FF3B30' : '#666'} 
            style={styles.icon} 
          />
        )}
        
        <Text style={[
          styles.pickerText,
          !selectedOption && styles.placeholderText,
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pickerError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  icon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default FormPicker;