import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useAuthStore } from "../store/useAuthStore";
import login_cover_photo from "../assets/login_cover_photo.jpg";
import { colors, radii } from "../theme";

/* -------------------- TYPES -------------------- */

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Login">;

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  password: z.string().regex(/^\d{4}$/, "Enter 4-digit PIN"),
});

type FormValues = z.infer<typeof schema>;

/* -------------------- SCREEN -------------------- */

function LoginScreen() {
  const [inputFocused, setInputFocused] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const imageWidth = useRef(new Animated.Value(200)).current;
  const imageHeight = useRef(new Animated.Value(300)).current;
  const imageRadius = useRef(new Animated.Value(24)).current;

  const navigation = useNavigation<NavigationProps>();
  const { signIn } = useAuthStore();

  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mobile: "", password: "" },
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imageWidth, {
        toValue: inputFocused ? 100 : 200,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(imageHeight, {
        toValue: inputFocused ? 150 : 300,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(imageRadius, {
        toValue: inputFocused ? 12 : 24,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [inputFocused, imageWidth, imageHeight, imageRadius]);

  const onSubmit = async (values: FormValues) => {
    setAuthError(null);
    try {
      await signIn(values.mobile, values.password);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
    }
  };

  const digitsOnly = (text: string) => text.replace(/\D/g, "");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              {/* LOGO */}
              <View style={styles.logoWrap}>
                <Animated.Image
                  source={login_cover_photo}
                  style={[
                    styles.logo,
                    {
                      width: imageWidth,
                      height: imageHeight,
                      borderRadius: imageRadius,
                    },
                  ]}
                  resizeMode="cover"
                />
              </View>

              {/* TITLE */}
              <Text style={styles.title}>Welcome</Text>

              {/* MOBILE */}
              <TextInput
                label="Mobile Number"
                mode="outlined"
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.input}
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
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              {errors.mobile && (
                <Text style={styles.errorText}>{errors.mobile.message}</Text>
              )}

              {/* PASSWORD */}
              <TextInput
                label="4-digit PIN"
                mode="outlined"
                secureTextEntry
                style={styles.passwordInput}
                keyboardType="number-pad"
                maxLength={4}
                outlineColor={colors.mutedLight}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                placeholderTextColor={colors.muted}
                selectionColor={colors.primary}
                cursorColor={colors.primary}
                outlineStyle={{ borderRadius: radii.medium }}
                left={<TextInput.Icon icon="lock" color={colors.muted} />}
                onChangeText={(t) =>
                  setValue("password", digitsOnly(t).slice(0, 4), {
                    shouldValidate: true,
                  })
                }
                error={!!errors.password}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              {authError ? (
                <Text style={styles.errorText}>{authError}</Text>
              ) : null}

              {/* LOGIN BUTTON */}
              <Button
                mode="contained"
                loading={isSubmitting}
                style={styles.loginButton}
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => handleSubmit(onSubmit)(), 100);
                }}
              >
                <Text style={styles.loginText}>Login</Text>
              </Button>

              {/* REGISTER LINK */}
              <Text
                style={styles.registerText}
                onPress={() => navigation.navigate("Register")}
              >
                Not a member? Register now
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default LoginScreen;

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  errorText: {
    color: colors.primary,
    marginTop: 4,
  },

  flex: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  loginText: {
    color: colors.white,
    fontWeight: "600",
  },
  logo: {
    resizeMode: "cover",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 80,
  },
  input: {
    backgroundColor: colors.backgroundSoft,
  },
  passwordInput: {
    marginTop: 12,
    backgroundColor: colors.backgroundSoft,
  },
  registerText: {
    color: colors.primary,
    marginTop: 16,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
});
