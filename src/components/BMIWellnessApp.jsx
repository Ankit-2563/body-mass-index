import React, { useState, useEffect } from "react";
import {
  Activity,
  Heart,
  TrendingUp,
  User,
  Calendar,
  Target,
  Award,
  History,
  Download,
  Trash2,
} from "lucide-react";

export default function BMIWellnessApp() {
  const [weight, setWeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [idealWeight, setIdealWeight] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [bmr, setBmr] = useState(null);
  const [activityLevel, setActivityLevel] = useState("sedentary");

  // Load history from memory on mount
  useEffect(() => {
    const stored = [];
    setHistory(stored);
  }, []);

  // Convert feet and inches to meters
  const convertHeightToMeters = () => {
    if (heightFeet || heightInches) {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;

      // Convert to total inches first
      const totalInches = feet * 12 + inches;

      // Convert inches to meters (1 inch = 0.0254 meters)
      const heightInMeters = totalInches * 0.0254;

      return heightInMeters;
    }
    return 0;
  };

  // Convert feet and inches to centimeters for display
  const convertHeightToCm = () => {
    if (heightFeet || heightInches) {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;

      // Convert to total inches first
      const totalInches = feet * 12 + inches;

      // Convert inches to cm (1 inch = 2.54 cm)
      const heightInCm = totalInches * 2.54;

      return heightInCm.toFixed(1);
    }
    return 0;
  };

  const calculateBMI = () => {
    const heightInMeters = convertHeightToMeters();

    if (weight && heightInMeters > 0) {
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);

      let cat = "";
      let advice = "";
      if (bmiValue < 18.5) {
        cat = "Underweight";
        advice =
          "Consider consulting a nutritionist to reach a healthy weight.";
      } else if (bmiValue < 25) {
        cat = "Normal Weight";
        advice = "Great! Maintain your healthy lifestyle.";
      } else if (bmiValue < 30) {
        cat = "Overweight";
        advice = "Consider regular exercise and balanced nutrition.";
      } else {
        cat = "Obese";
        advice = "Consult a healthcare professional for personalized guidance.";
      }

      setCategory(cat);

      // Calculate ideal weight range (BMI 18.5-24.9)
      const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
      const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);
      setIdealWeight({ min: minIdeal, max: maxIdeal });

      // Calculate BMR (Basal Metabolic Rate) using height in cm
      if (age) {
        const heightInCm = convertHeightToCm();
        let bmrValue;
        if (gender === "male") {
          bmrValue = (10 * weight + 6.25 * heightInCm - 5 * age + 5).toFixed(0);
        } else {
          bmrValue = (10 * weight + 6.25 * heightInCm - 5 * age - 161).toFixed(
            0
          );
        }
        setBmr(bmrValue);
      }

      // Save to history
      const newEntry = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        weight: parseFloat(weight),
        heightFeet: parseFloat(heightFeet) || 0,
        heightInches: parseFloat(heightInches) || 0,
        heightDisplay: `${heightFeet || 0}'${heightInches || 0}"`,
        bmi: parseFloat(bmiValue),
        category: cat,
      };
      setHistory([newEntry, ...history].slice(0, 10)); // Keep last 10 entries

      setShowResult(true);
    }
  };

  const resetCalculator = () => {
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
    setAge("");
    setBmi(null);
    setCategory("");
    setShowResult(false);
    setIdealWeight(null);
    setBmr(null);
  };

  const getBMIColor = () => {
    if (!bmi) return "bg-gray-400";
    if (bmi < 18.5) return "bg-blue-500";
    if (bmi < 25) return "bg-green-500";
    if (bmi < 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getHealthTip = () => {
    if (!bmi) return "";
    if (bmi < 18.5)
      return "Focus on nutrient-dense foods and strength training.";
    if (bmi < 25)
      return "Keep up the great work with balanced diet and exercise!";
    if (bmi < 30) return "Try 30 minutes of moderate exercise most days.";
    return "Consult a healthcare provider for a personalized plan.";
  };

  const getCalorieNeeds = () => {
    if (!bmr) return null;
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    return (bmr * multipliers[activityLevel]).toFixed(0);
  };

  const deleteHistoryEntry = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(
      {
        currentBMI: bmi,
        category,
        history,
      },
      null,
      2
    );
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bmi-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Hero Section */}
      <div className="relative h-screen bg-gradient-to-br from-stone-800 to-stone-600">
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&q=80"
          alt="Yoga wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
          <p className="text-sm tracking-widest mb-4 opacity-80">
            WELLNESS TRACKING MADE SIMPLE
          </p>
          <h1 className="text-6xl md:text-7xl font-light mb-6 text-center">
            Your BMI Studio
            <div className="italic font-serif">Calculator</div>
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Track your health journey with precision
          </p>
          <div className="flex gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("calculator")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-stone-800 px-8 py-3 rounded-full hover:bg-stone-100 transition"
            >
              Calculate BMI
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-stone-800 transition flex items-center gap-2"
            >
              <History size={20} />
              View History
            </button>
          </div>
        </div>

        {/* Scrolling text */}
        <div className="absolute bottom-0 left-0 right-0 bg-stone-900 py-3 overflow-hidden">
          <div className="flex gap-8 animate-scroll whitespace-nowrap text-white text-sm">
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="flex items-center gap-2">
                  <Activity size={16} /> Stronger
                </span>
                <span className="flex items-center gap-2">
                  <Heart size={16} /> Connected
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp size={16} /> Empowered
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <p className="text-sm tracking-widest text-stone-500 mb-4">BMI TOOLS</p>
        <h2 className="text-4xl md:text-5xl font-light mb-6">
          Welcome to Your Wellness
          <div className="italic font-serif text-stone-600">Calculator</div>
        </h2>
        <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
          Your journey begins here. Calculate your BMI now. Whether you're
          tracking your progress or starting fresh, we're here to support you
          every step of the way.
        </p>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light">BMI History</h3>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <>
                    <button
                      onClick={exportData}
                      className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </button>
                    <button
                      onClick={clearHistory}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Clear All
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 border-2 border-stone-800 text-stone-800 rounded-lg hover:bg-stone-800 hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>No history yet. Calculate your BMI to start tracking!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-stone-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-stone-500">{entry.date}</p>
                        <p className="text-xs text-stone-400">{entry.time}</p>
                      </div>
                      <div className="w-px h-12 bg-stone-300"></div>
                      <div>
                        <p className="font-medium text-lg">BMI: {entry.bmi}</p>
                        <p className="text-sm text-stone-600">
                          {entry.category}
                        </p>
                        <p className="text-xs text-stone-500">
                          {entry.weight}kg • {entry.heightDisplay}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHistoryEntry(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calculator Section */}
      <div id="calculator" className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-light mb-12 text-center">
          Start your wellness
          <span className="italic font-serif text-stone-600"> journey</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-stone-600" size={20} />
                <h4 className="text-xl font-medium">Enter Your Details</h4>
              </div>
              <p className="text-sm text-stone-500">
                Input your measurements to calculate BMI
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">
                    Height
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="5"
                      min="0"
                      max="9"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                    />
                    <span className="flex items-center text-stone-500 text-sm">
                      ft
                    </span>
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="8"
                      min="0"
                      max="11"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                    />
                    <span className="flex items-center text-stone-500 text-sm">
                      in
                    </span>
                  </div>
                  {(heightFeet || heightInches) && (
                    <p className="text-xs text-stone-400 mt-1">
                      ({convertHeightToCm()} cm)
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">
                    Age (optional)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-stone-700">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                >
                  <option value="sedentary">
                    Sedentary (little/no exercise)
                  </option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="veryActive">
                    Very Active (twice per day)
                  </option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={calculateBMI}
                  className="flex-1 bg-stone-800 text-white py-3 rounded-full hover:bg-stone-700 transition"
                >
                  Calculate BMI
                </button>
                {showResult && (
                  <button
                    onClick={resetCalculator}
                    className="px-6 border-2 border-stone-800 text-stone-800 py-3 rounded-full hover:bg-stone-800 hover:text-white transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result Card - Rest of the component remains the same */}
          <div className="bg-gradient-to-br from-stone-700 to-stone-900 rounded-lg shadow-sm p-8 text-white">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="text-white" size={20} />
                <h4 className="text-xl font-medium">Your Results</h4>
              </div>
              <p className="text-sm text-stone-300">
                Your BMI calculation and insights
              </p>
            </div>

            {showResult ? (
              <div className="space-y-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
                  <p className="text-sm opacity-80 mb-2">Your BMI</p>
                  <div className="text-6xl font-light mb-2">{bmi}</div>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getBMIColor()}`}
                  >
                    {category}
                  </div>
                </div>

                {idealWeight && (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={18} />
                      <p className="text-sm font-medium">Ideal Weight Range</p>
                    </div>
                    <p className="text-2xl font-light">
                      {idealWeight.min} - {idealWeight.max} kg
                    </p>
                  </div>
                )}

                {bmr && (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} />
                      <p className="text-sm font-medium">Daily Calorie Needs</p>
                    </div>
                    <p className="text-2xl font-light">
                      {getCalorieNeeds()} kcal/day
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      Based on your activity level
                    </p>
                  </div>
                )}

                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-sm opacity-80 mb-1">Health Tip</p>
                  <p className="text-sm">{getHealthTip()}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Heart size={48} className="mb-4 opacity-50" />
                <p className="opacity-70">
                  Enter your details to calculate your BMI
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6">
                What to Know
                <div className="italic font-serif text-stone-600">
                  about BMI
                </div>
              </h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                BMI (Body Mass Index) is a screening tool that helps assess
                whether your weight is healthy for your height. While it's a
                useful indicator, remember that it's just one measure of health.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-stone-800 mt-2"></div>
                  <p className="text-stone-700">
                    BMI is calculated using weight and height measurements
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-stone-800 mt-2"></div>
                  <p className="text-stone-700">
                    Results are categorized into weight status groups
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-stone-800 mt-2"></div>
                  <p className="text-stone-700">
                    BMR helps determine your daily calorie needs
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-stone-800 mt-2"></div>
                  <p className="text-stone-700">
                    Regular tracking helps monitor your wellness journey
                  </p>
                </div>
              </div>
            </div>

            <div className="relative bg-stone-200 rounded-lg h-96 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
                alt="Fitness tracking"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-stone-900 text-white py-12 px-6 text-center">
        <p className="text-sm opacity-70">
          © 2025 BMI Wellness Studio. Supporting your health journey.
        </p>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
