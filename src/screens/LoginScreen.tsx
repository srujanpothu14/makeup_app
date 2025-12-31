import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
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

export default function LoginScreen() {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
              Welcome
            </Text>
            <TextInput
              label="Mobile Number"
              mode="outlined"
              keyboardType="phone-pad"
              onChangeText={(t) => setValue("mobile", t)}
              error={!!errors.mobile}
              defaultValue={""}
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
              Sign In
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
  );
}
