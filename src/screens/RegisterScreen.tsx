import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
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
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpToken, setOtpToken] = useState<string | undefined>(undefined);
  const [cooldown, setCooldown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const navigation = useNavigation<NavigationProps>();
  const { signUp, requestOtp, verifyOtp } = useAuthStore();

  const {
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", mobile: "", otp: "", pin: "" },
  });

  const mobileValue = watch("mobile");
  const otpValue = watch("otp");
  const pinValue = watch("pin");

  const digitsOnly = (text: string) => text.replace(/\D/g, "");
  const mobileDigits = digitsOnly(mobileValue);
  const otpDigits = digitsOnly(otpValue);
  const canSendOtp = mobileDigits.length === 10;
  const canVerifyOtp = otpDigits.length === 6;

  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }
    };
  }, []);

  const startCooldown = (seconds: number) => {
    const total = Math.max(0, Math.min(seconds, 300));
    setCooldown(total);
    if (total === 0) return;

    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }

    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    cooldownIntervalRef.current = interval;
  };

  const isBusy = isSubmitting || sendingOtp || verifyingOtp;

  const handleSendOtp = async () => {
    setAuthError(null);
    Keyboard.dismiss();

    const ok = await trigger(["mobile"]);
    if (!ok) return;

    try {
      setSendingOtp(true);
      const res = await requestOtp(mobileDigits);
      setOtpSent(true);
      setOtpVerified(false);
      setOtpToken(undefined);
      setValue("otp", "", { shouldValidate: false });
      startCooldown(res.expiresIn ?? 30);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Failed to send OTP",
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError(null);
    Keyboard.dismiss();

    const ok = await trigger(["mobile", "otp"]);
    if (!ok) return;

    try {
      setVerifyingOtp(true);
      const verify = await verifyOtp(mobileDigits, otpDigits);
      if (!verify.verified) {
        throw new Error(verify.message ?? "OTP verification failed");
      }
      setOtpVerified(true);
      setOtpToken(verify.otpToken);
    } catch (error) {
      setOtpVerified(false);
      setOtpToken(undefined);
      setAuthError(
        error instanceof Error ? error.message : "Failed to verify OTP",
      );
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onRegister = async (values: FormValues) => {
    setAuthError(null);
    Keyboard.dismiss();

    if (!otpVerified) {
      setAuthError("Please verify OTP first");
      return;
    }

    try {
      await signUp(
        values.name,
        values.mobile,
        values.pin,
        values.otp,
        otpToken,
      );
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          editable={!isBusy}
          onChangeText={(t) => setValue("name", t, { shouldValidate: true })}
          error={!!errors.name}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <View style={styles.mobileFieldWrap}>
          <TextInput
            label="Mobile Number"
            mode="outlined"
            keyboardType="phone-pad"
            style={[styles.input, styles.inputNoMargin]}
            maxLength={10}
            outlineColor={colors.mutedLight}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.muted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            outlineStyle={{ borderRadius: radii.medium }}
            left={<TextInput.Icon icon="phone" color={colors.muted} />}
            contentStyle={styles.mobileContent}
            editable={!isBusy && !otpSent && !otpVerified}
            onChangeText={(t) =>
              setValue("mobile", digitsOnly(t), { shouldValidate: true })
            }
            error={!!errors.mobile}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={otpSent ? "Resend OTP" : "Send OTP"}
            disabled={isBusy || otpVerified || cooldown > 0 || !canSendOtp}
            onPress={handleSendOtp}
            style={({ pressed }) => [
              styles.pillBase,
              styles.sendOtpPill,
              (isBusy || otpVerified || cooldown > 0 || !canSendOtp) &&
                styles.pillDisabled,
              pressed && !isBusy && styles.pillPressed,
            ]}
          >
            {sendingOtp && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.pillSpinner}
              />
            )}
            <Text
              style={
                cooldown > 0 || isBusy || !canSendOtp
                  ? styles.pillTextDisabled
                  : styles.pillText
              }
            >
              {sendingOtp
                ? "Sending"
                : otpSent && cooldown > 0
                  ? "Sent"
                  : otpSent
                    ? "Resend"
                    : "Send OTP"}
            </Text>
          </Pressable>
        </View>
        {errors.mobile && (
          <Text style={styles.errorText}>{errors.mobile.message}</Text>
        )}

        <View style={styles.otpFieldWrap}>
          <TextInput
            label="Enter 6-digit OTP"
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={[styles.input, styles.inputNoMargin]}
            outlineColor={colors.mutedLight}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
            placeholderTextColor={colors.muted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            outlineStyle={{ borderRadius: radii.medium }}
            left={<TextInput.Icon icon="message-text" color={colors.muted} />}
            contentStyle={styles.otpContent}
            editable={!isBusy && otpSent && !otpVerified}
            onChangeText={(t) =>
              setValue("otp", digitsOnly(t).slice(0, 6), {
                shouldValidate: otpSent,
              })
            }
            error={!!errors.otp}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={otpVerified ? "OTP verified" : "Verify OTP"}
            disabled={isBusy || !otpSent || otpVerified || !canVerifyOtp}
            onPress={handleVerifyOtp}
            style={({ pressed }) => [
              styles.pillBase,
              styles.verifyOtpPill,
              (isBusy || !otpSent || otpVerified || !canVerifyOtp) &&
                styles.pillDisabled,
              pressed && !isBusy && styles.pillPressed,
            ]}
          >
            {verifyingOtp && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.pillSpinner}
              />
            )}
            <Text
              style={
                isBusy || !otpSent || !canVerifyOtp
                  ? styles.pillTextDisabled
                  : styles.pillText
              }
            >
              {verifyingOtp ? "Verifying" : otpVerified ? "Verified" : "Verify"}
            </Text>
          </Pressable>
        </View>
        {(otpSent || otpValue.length > 0) && errors.otp && (
          <Text style={styles.errorText}>{errors.otp.message}</Text>
        )}

        {otpSent && !otpVerified && (
          <Text style={styles.helperText}>
            {cooldown > 0
              ? `You can resend OTP in ${cooldown}s`
              : "Didn’t get OTP? Tap Send OTP again."}
          </Text>
        )}

        {otpVerified && (
          <Text style={styles.successText}>Mobile number verified</Text>
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
          editable={!isBusy && otpVerified}
          onChangeText={(t) =>
            setValue("pin", digitsOnly(t).slice(0, 4), { shouldValidate: true })
          }
          error={!!errors.pin}
        />
        {(otpVerified || pinValue.length > 0) && errors.pin && (
          <Text style={styles.errorText}>{errors.pin.message}</Text>
        )}

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <Button
          mode="contained"
          style={styles.button}
          loading={isSubmitting}
          disabled={isBusy || !otpVerified}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => handleSubmit(onRegister)(), 100);
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
    </TouchableWithoutFeedback>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  mobileFieldWrap: {
    marginTop: 12,
    position: "relative",
  },
  mobileContent: {
    paddingRight: 96,
  },
  otpFieldWrap: {
    marginTop: 12,
    position: "relative",
  },
  otpContent: {
    paddingRight: 88,
  },
  pillBase: {
    position: "absolute",
    right: 12,
    top: 15,
    zIndex: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  sendOtpPill: {
    minWidth: 74,
  },
  verifyOtpPill: {
    minWidth: 66,
  },
  pillPressed: {
    opacity: 0.85,
  },
  pillDisabled: {
    backgroundColor: colors.placeholder,
  },
  pillText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  pillTextDisabled: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
  },
  pillSpinner: {
    marginRight: 6,
  },
  helperText: {
    color: colors.subdued,
    marginTop: 8,
  },
  successText: {
    color: colors.primary,
    fontWeight: "700",
    marginTop: 8,
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
  inputNoMargin: {
    marginTop: 0,
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
