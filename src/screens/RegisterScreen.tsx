import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import { colors } from '../theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput label="Name" mode="outlined" style={styles.input} />

      <TextInput
        label="Mobile Number"
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput label="Password" mode="outlined" secureTextEntry style={styles.input} />

      <Button mode="contained" style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </Button>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 12,
  },

  title: {
    color: colors.text,
    fontFamily: 'RalewayBold',
    fontSize: 22,
    marginBottom: 12,
  },
});
