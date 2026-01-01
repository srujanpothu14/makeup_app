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
} from "react-native";
import { Animated } from "react-native";
const LOGIN_IMAGE = require("../assets/login_cover_photo.jpg");
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput, Button } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Login">;

const schema = z.object({
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Invalid mobile number")
    .min(10, "Mobile number must be 10 digits"),
  password: z.string().min(6, "Min 6 chars"),
});

type FormValues = z.infer<typeof schema>;

function LoginScreen() {
  const [inputFocused, setInputFocused] = useState(false);
  const imageWidth = useRef(new Animated.Value(200)).current;
  const imageHeight = useRef(new Animated.Value(300)).current;
  const imageRadius = useRef(new Animated.Value(24)).current;

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

  const handleFocus = () => setInputFocused(true);
  const handleBlur = () => setInputFocused(false);
  const navigation = useNavigation<NavigationProps>(); // Hook to navigate between screens
  const { signIn } = useAuthStore();
  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mobile: "", password: "password" },
  });

  const onSubmit = async (values: FormValues) => {
    await signIn(values.mobile, values.password);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <View
                style={{ alignItems: "center", marginTop: 80, marginBottom: 8 }}
              >
                <Animated.Image
                  source={LOGIN_IMAGE}
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                    borderRadius: imageRadius,
                  }}
                  resizeMode="cover"
                />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                Welcome
              </Text>
              <TextInput
                label="Mobile Number"
                mode="outlined"
                keyboardType="phone-pad"
                onChangeText={(t) => setValue("mobile", t)}
                error={!!errors.mobile}
                defaultValue={""}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.mobile && (
                <Text style={{ color: "red" }}>{errors.mobile.message}</Text>
              )}
              <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={{ marginTop: 12 }}
                onChangeText={(t) => setValue("password", t)}
                error={!!errors.password}
                defaultValue={"password"}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {errors.password && (
                <Text style={{ color: "red" }}>{errors.password.message}</Text>
              )}
              <Button
                mode="contained"
                onPress={() => {
                  Keyboard.dismiss();
                  setTimeout(() => handleSubmit(onSubmit)(), 100);
                }}
                loading={isSubmitting}
                style={{ marginTop: 16 }}
              >
                Login
              </Button>
              <Text
                style={{ marginTop: 16, textAlign: "center", color: "blue" }}
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
