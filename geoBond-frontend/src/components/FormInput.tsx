import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  maxLength?: number;
  editable?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  maxLength,
  editable = true,
  icon,
  error,
  required = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {maxLength && (
          <Text style={styles.charCount}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      
      <View style={[
        styles.inputContainer,
        error && styles.inputError,
        !editable && styles.inputDisabled,
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={error ? '#FF3B30' : '#666'} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon && styles.inputWithIcon,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#FF3B30',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default FormInput;