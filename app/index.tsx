import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Input,
  Layout,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React, { useState } from "react";
import { Alert, Platform, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator"; // 180-degree circular progress

export default function App() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const theme = useTheme();

  const MIN_WEIGHT = 30;
  const MAX_WEIGHT = 300;
  const MIN_HEIGHT = 100;
  const MAX_HEIGHT = 250;

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    if (!validateInputs(weightValue, heightValue)) {
      return;
    }

    const heightInMeters = heightValue / 100;
    const bmiValue = weightValue / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(2)));
    classifyBMI(bmiValue);
  };

  const validateInputs = (weightValue: number, heightValue: number) => {
    if (!weightValue || !heightValue) {
      showAlert("Input Error", "Please enter both weight and height.");
      return false;
    }

    if (weightValue < MIN_WEIGHT || weightValue > MAX_WEIGHT) {
      showAlert(
        "Input Error",
        `Weight should be between ${MIN_WEIGHT} kg and ${MAX_WEIGHT} kg.`
      );
      return false;
    }

    if (heightValue < MIN_HEIGHT || heightValue > MAX_HEIGHT) {
      showAlert(
        "Input Error",
        `Height should be between ${MIN_HEIGHT} cm and ${MAX_HEIGHT} cm.`
      );
      return false;
    }

    return true;
  };

  const classifyBMI = (bmiValue: number) => {
    if (bmiValue < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmiValue < 24.9) {
      setBmiCategory("Normal");
    } else if (bmiValue < 29.9) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obese");
    }
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setBmiCategory("");
  };

  const getProgressColor = () => {
    switch (bmiCategory) {
      case "Underweight":
        return theme["color-info-500"];
      case "Normal":
        return theme["color-success-500"];
      case "Overweight":
        return theme["color-warning-500"];
      case "Obese":
        return theme["color-danger-500"];
      default:
        return "#28a745"; // Default color for progress
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <Text category="h1">BMI Calculator</Text>

        <Input
          style={{ marginTop: 20, width: "20%" }} // Reduce width for better layout
          placeholder="Enter your weight (kg)"
          value={weight}
          inputMode="numeric"
          onChangeText={setWeight}
          status={
            weight &&
            (parseFloat(weight) < MIN_WEIGHT || parseFloat(weight) > MAX_WEIGHT)
              ? "danger"
              : "basic"
          }
        />
        {weight &&
          (parseFloat(weight) < MIN_WEIGHT ||
            parseFloat(weight) > MAX_WEIGHT) && (
            <Text status="danger" category="c1">
              Weight must be between {MIN_WEIGHT} and {MAX_WEIGHT} kg.
            </Text>
          )}

        <Input
          style={{ marginTop: 20, width: "20%" }} // Reduce width for better layout
          placeholder="Enter your height (cm)"
          value={height}
          inputMode="numeric"
          onChangeText={setHeight}
          status={
            height &&
            (parseFloat(height) < MIN_HEIGHT || parseFloat(height) > MAX_HEIGHT)
              ? "danger"
              : "basic"
          }
        />
        {height &&
          (parseFloat(height) < MIN_HEIGHT ||
            parseFloat(height) > MAX_HEIGHT) && (
            <Text status="danger" category="c1">
              Height must be between {MIN_HEIGHT} and {MAX_HEIGHT} cm.
            </Text>
          )}

        <Button
          style={{
            marginTop: 20,
            width: "20%",
            borderRadius: 8,
          }}
          onPress={calculateBMI}
        >
          Calculate BMI
        </Button>

        {bmi !== null && (
          <>
            <Button
              style={{ marginTop: 10, width: "20%", borderRadius: 8 }}
              onPress={resetForm}
              status="basic"
            >
              Try Again
            </Button>

            <View style={{ marginTop: 30, alignItems: "center" }}>
              <Text category="h4" style={{ fontSize: 26, fontWeight: "bold" }}>
                Your BMI is: {bmi}
              </Text>
              <Text
                category="h5"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color:
                    bmiCategory === "Underweight"
                      ? theme["color-info-500"]
                      : bmiCategory === "Normal"
                      ? theme["color-success-500"]
                      : bmiCategory === "Overweight"
                      ? theme["color-warning-500"]
                      : theme["color-danger-500"],
                }}
              >
                {bmiCategory}
              </Text>

              <CircularProgress
                value={bmi}
                radius={100}
                duration={2500} // Increased duration for smoother transition
                activeStrokeWidth={12}
                inActiveStrokeWidth={12}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={getProgressColor()} // Dynamic color based on BMI category
                inActiveStrokeColor="#cccccc"
                strokeLinecap="round"
                maxValue={40} // Set the maximum value of the BMI range
                titleColor="#000"
                titleStyle={{ fontWeight: "bold", fontSize: 24 }} // Adjust font size
                title="" // Remove title to prevent duplicate value
                valueSuffix="" // Remove the suffix to avoid showing extra value
                rotation={-90} // Start from the bottom of the circle (180 degrees)
                clockwise={false} // Ensure it behaves like a 180-degree gauge
              />
            </View>
          </>
        )}
      </Layout>
    </ApplicationProvider>
  );
}
