import React, { useState } from "react";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors, radii } from "../theme";
import { useAuthStore } from "../store/useAuthStore";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [authError, setAuthError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProps>();
  const { signUp } = useAuthStore();

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", mobile: "", pin: "" },
  });

  const digitsOnly = (text: string) => text.replace(/\D/g, "");

  const onSubmit = async (values: FormValues) => {
    setAuthError(null);
    try {
      await signUp(values.name, values.mobile, values.pin);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <TextInput
        label="Name"
        mode="outlined"
        style={styles.input}
        outlineColor={colors.mutedLight}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        outlineStyle={{ borderRadius: radii.medium }}
        left={<TextInput.Icon icon="account" color={colors.muted} />}
        autoCapitalize="words"
        autoCorrect={false}
        onChangeText={(t) => setValue("name", t, { shouldValidate: true })}
        error={!!errors.name}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )}

      <TextInput
        label="Mobile Number"
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
        maxLength={10}
        outlineColor={colors.mutedLight}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        outlineStyle={{ borderRadius: radii.medium }}
        left={<TextInput.Icon icon="phone" color={colors.muted} />}
        onChangeText={(t) =>
          setValue("mobile", digitsOnly(t), { shouldValidate: true })
        }
        error={!!errors.mobile}
      />
      {errors.mobile && (
        <Text style={styles.errorText}>{errors.mobile.message}</Text>
      )}

      <TextInput
        label="4-digit PIN"
        mode="outlined"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={4}
        style={styles.input}
        outlineColor={colors.mutedLight}
        activeOutlineColor={colors.primary}
        textColor={colors.text}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
        cursorColor={colors.primary}
        outlineStyle={{ borderRadius: radii.medium }}
        left={<TextInput.Icon icon="lock" color={colors.muted} />}
        onChangeText={(t) =>
          setValue("pin", digitsOnly(t).slice(0, 4), { shouldValidate: true })
        }
        error={!!errors.pin}
      />
      {errors.pin && <Text style={styles.errorText}>{errors.pin.message}</Text>}

      {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

      <Button
        mode="contained"
        style={styles.button}
        loading={isSubmitting}
        onPress={() => {
          Keyboard.dismiss();
          setTimeout(() => handleSubmit(onSubmit)(), 100);
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Button>

      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
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
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
  },
  input: {
    backgroundColor: colors.backgroundSoft,
    marginTop: 12,
  },
  errorText: {
    color: colors.primary,
    marginTop: 4,
  },
  loginText: {
    color: colors.primary,
    marginTop: 16,
    textAlign: "center",
  },

  title: {
    color: colors.text,
    fontFamily: "RalewayBold",
    fontSize: 22,
    marginBottom: 12,
  },
});
