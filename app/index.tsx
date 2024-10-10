import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Button,
  IconRegistry,
  Input,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React, { useState } from "react";
import { Alert, Dimensions, Platform, ScrollView, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

export default function App() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");

  const screenWidth = Dimensions.get("window").width;

  const MIN_WEIGHT = 60;
  const MAX_WEIGHT = 660;
  const MIN_HEIGHT = 36;
  const MAX_HEIGHT = 100;
  const MIN_AGE = 18;
  const MAX_AGE = 100;

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
    const ageValue = parseFloat(age);

    if (!validateInputs(weightValue, heightValue, ageValue)) {
      return;
    }

    const bmiValue = (weightValue / (heightValue * heightValue)) * 703;
    setBmi(parseFloat(bmiValue.toFixed(2)));
    classifyBMI(bmiValue);
  };

  const validateInputs = (
    weightValue: number,
    heightValue: number,
    ageValue: number
  ) => {
    if (!weightValue || !heightValue || !ageValue) {
      showAlert("Input Error", "Please enter weight, height, and age.");
      return false;
    }

    if (weightValue < MIN_WEIGHT || weightValue > MAX_WEIGHT) {
      showAlert(
        "Input Error",
        `Weight should be between ${MIN_WEIGHT} lbs and ${MAX_WEIGHT} lbs.`
      );
      return false;
    }

    if (heightValue < MIN_HEIGHT || heightValue > MAX_HEIGHT) {
      showAlert(
        "Input Error",
        `Height should be between ${MIN_HEIGHT} inches and ${MAX_HEIGHT} inches.`
      );
      return false;
    }

    if (ageValue < MIN_AGE || ageValue > MAX_AGE) {
      showAlert(
        "Input Error",
        `Age should be between ${MIN_AGE} and ${MAX_AGE} years.`
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
    setAge("");
    setBmi(null);
    setBmiCategory("");
  };

  const getProgressColor = () => {
    switch (bmiCategory) {
      case "Underweight":
        return "#17a2b8"; // Hex code for a blue color
      case "Normal":
        return "#28a745"; // Hex code for a green color
      case "Overweight":
        return "#ffc107"; // Hex code for a yellow color
      case "Obese":
        return "#dc3545"; // Hex code for a red color
      default:
        return "#6c757d"; // Default gray color
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Layout
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
            width: "100%",
          }}
        >
          <Text category="h1" style={{ fontSize: screenWidth > 600 ? 32 : 28 }}>
            BMI Calculator
          </Text>

          {/* Input fields */}
          <View
            style={{ width: screenWidth > 600 ? "40%" : "90%", marginTop: 20 }}
          >
            <Text
              category="label"
              style={{ fontSize: screenWidth > 600 ? 18 : 16 }}
            >
              Weight (lbs)
            </Text>
            <Input
              placeholder="Enter your weight (lbs)"
              value={weight}
              inputMode="numeric"
              onChangeText={setWeight}
              status={
                weight &&
                (parseFloat(weight) < MIN_WEIGHT ||
                  parseFloat(weight) > MAX_WEIGHT)
                  ? "danger"
                  : "basic"
              }
              textStyle={{ fontSize: screenWidth > 600 ? 18 : 16 }} // Responsive font size
            />
          </View>

          <View
            style={{ width: screenWidth > 600 ? "40%" : "90%", marginTop: 20 }}
          >
            <Text
              category="label"
              style={{ fontSize: screenWidth > 600 ? 18 : 16 }}
            >
              Height (inches)
            </Text>
            <Input
              placeholder="Enter your height (inches)"
              value={height}
              inputMode="numeric"
              onChangeText={setHeight}
              status={
                height &&
                (parseFloat(height) < MIN_HEIGHT ||
                  parseFloat(height) > MAX_HEIGHT)
                  ? "danger"
                  : "basic"
              }
              textStyle={{ fontSize: screenWidth > 600 ? 18 : 16 }} // Responsive font size
            />
          </View>

          <View
            style={{ width: screenWidth > 600 ? "40%" : "90%", marginTop: 20 }}
          >
            <Text
              category="label"
              style={{ fontSize: screenWidth > 600 ? 18 : 16 }}
            >
              Age (years)
            </Text>
            <Input
              placeholder="Enter your age (years)"
              value={age}
              inputMode="numeric"
              onChangeText={setAge}
              status={
                age && (parseFloat(age) < MIN_AGE || parseFloat(age) > MAX_AGE)
                  ? "danger"
                  : "basic"
              }
              textStyle={{ fontSize: screenWidth > 600 ? 18 : 16 }} // Responsive font size
            />
          </View>

          {/* Calculate BMI button */}
          <Button
            style={{
              marginTop: 30,
              width: screenWidth > 600 ? "40%" : "90%",
              borderRadius: 8,
              paddingVertical: 15, // Adjust for better button size
            }}
            onPress={calculateBMI}
          >
            Calculate BMI
          </Button>

          {/* Results */}
          {bmi !== null && (
            <>
              <Button
                style={{
                  marginTop: 20,
                  width: screenWidth > 600 ? "40%" : "90%",
                  borderRadius: 8,
                  paddingVertical: 15, // Adjust for better button size
                }}
                onPress={resetForm}
                status="basic"
              >
                Try Again
              </Button>

              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Text
                  category="h4"
                  style={{
                    fontSize: screenWidth > 600 ? 26 : 22,
                    fontWeight: "bold",
                  }}
                >
                  Your BMI is: {bmi}
                </Text>

                {/* Space between text and circle */}
                <Text
                  category="h5"
                  style={{
                    fontSize: screenWidth > 600 ? 20 : 18,
                    fontWeight: "bold",
                    marginBottom: 15,
                    color: getProgressColor(),
                  }}
                >
                  {bmiCategory}
                </Text>

                <CircularProgress
                  value={bmi}
                  radius={screenWidth > 600 ? 100 : 80} // Adjust circle size for screen width
                  duration={2500}
                  activeStrokeWidth={12}
                  inActiveStrokeWidth={12}
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={getProgressColor()} // Dynamic color based on BMI category
                  inActiveStrokeColor="#cccccc"
                  strokeLinecap="round"
                  maxValue={40} // Max BMI value
                  titleColor="#000"
                  titleStyle={{ fontWeight: "bold", fontSize: 24 }}
                  title=""
                  valueSuffix=""
                  rotation={0} // Start from top (0 degrees)
                  clockwise={true} // Rotate clockwise for full 360 degrees
                />
              </View>
            </>
          )}
        </Layout>
      </ScrollView>
    </ApplicationProvider>
  );
}
