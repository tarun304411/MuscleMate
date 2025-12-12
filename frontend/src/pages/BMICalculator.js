import { useState } from "react";

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male",
    activityLevel: "moderate"
  });
  
  const [bmiResult, setBmiResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    
    if (!formData.weight || !formData.height || !formData.age) {
      alert("Please fill all required fields");
      return;
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // Convert cm to meters
    const age = parseInt(formData.age);

    if (weight <= 0 || height <= 0 || age <= 0) {
      alert("Please enter valid values");
      return;
    }

    const bmi = weight / (height * height);
    const bmiCategory = getBMICategory(bmi);
    const exercisePlan = getExercisePlan(bmiCategory, formData.gender, age, formData.activityLevel);
    const nutritionTips = getNutritionTips(bmiCategory);

    setBmiResult({
      bmi: bmi.toFixed(1),
      category: bmiCategory,
      exercisePlan,
      nutritionTips
    });
    setShowResult(true);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    if (bmi < 35) return "Obese Class I";
    if (bmi < 40) return "Obese Class II";
    return "Obese Class III";
  };

  const getExercisePlan = (category, gender, age, activityLevel) => {
    const plans = {
      "Underweight": {
        cardio: "20-30 minutes, 3-4 times/week",
        strength: "Focus on compound movements, 4-5 times/week",
        flexibility: "Daily stretching, 10-15 minutes",
        recommendations: [
          "Focus on strength training to build muscle mass",
          "Include compound exercises: squats, deadlifts, bench press",
          "Eat in caloric surplus with protein-rich foods",
          "Rest days: 2-3 per week for muscle recovery"
        ]
      },
      "Normal weight": {
        cardio: "30-45 minutes, 4-5 times/week",
        strength: "Full body workouts, 3-4 times/week",
        flexibility: "Daily stretching, 15-20 minutes",
        recommendations: [
          "Maintain current fitness level with balanced routine",
          "Mix of cardio and strength training",
          "Include HIIT workouts for variety",
          "Rest days: 2 per week"
        ]
      },
      "Overweight": {
        cardio: "45-60 minutes, 5-6 times/week",
        strength: "Circuit training, 3-4 times/week",
        flexibility: "Daily stretching, 20 minutes",
        recommendations: [
          "Focus on cardio for fat burning",
          "Include resistance training to preserve muscle",
          "Low-impact exercises: walking, swimming, cycling",
          "Rest days: 1-2 per week"
        ]
      },
      "Obese Class I": {
        cardio: "30-45 minutes, 5-6 times/week",
        strength: "Light resistance training, 2-3 times/week",
        flexibility: "Daily stretching, 15 minutes",
        recommendations: [
          "Start with low-impact cardio: walking, swimming",
          "Gradually increase intensity and duration",
          "Focus on form and safety",
          "Rest days: 2-3 per week"
        ]
      },
      "Obese Class II": {
        cardio: "20-30 minutes, 4-5 times/week",
        strength: "Bodyweight exercises, 2 times/week",
        flexibility: "Daily stretching, 10 minutes",
        recommendations: [
          "Begin with walking and gentle stretching",
          "Consult healthcare provider before starting",
          "Focus on building endurance gradually",
          "Rest days: 3-4 per week"
        ]
      },
      "Obese Class III": {
        cardio: "15-20 minutes, 3-4 times/week",
        strength: "Chair exercises, 1-2 times/week",
        flexibility: "Daily gentle stretching, 5-10 minutes",
        recommendations: [
          "Medical supervision recommended",
          "Start with chair-based exercises",
          "Focus on mobility and basic movement",
          "Rest days: 4-5 per week"
        ]
      }
    };

    return plans[category] || plans["Normal weight"];
  };

  const getNutritionTips = (category) => {
    const tips = {
      "Underweight": [
        "Eat 5-6 small meals throughout the day",
        "Include healthy fats: nuts, avocados, olive oil",
        "High-protein foods: lean meats, eggs, dairy",
        "Complex carbs: whole grains, potatoes, rice"
      ],
      "Normal weight": [
        "Maintain balanced diet with all food groups",
        "Focus on whole foods over processed",
        "Stay hydrated with 8-10 glasses of water",
        "Moderate portion sizes"
      ],
      "Overweight": [
        "Create moderate caloric deficit (300-500 calories)",
        "High-protein, moderate-carb diet",
        "Include fiber-rich foods for satiety",
        "Limit added sugars and processed foods"
      ],
      "Obese Class I": [
        "Consult nutritionist for personalized plan",
        "Focus on whole, unprocessed foods",
        "Control portion sizes",
        "Keep food diary for accountability"
      ],
      "Obese Class II": [
        "Medical supervision for diet plan",
        "Gradual changes, not drastic restrictions",
        "Focus on sustainable habits",
        "Regular check-ins with healthcare team"
      ],
      "Obese Class III": [
        "Medical team supervision required",
        "Individualized nutrition plan",
        "Regular monitoring and adjustments",
        "Support group participation recommended"
      ]
    };

    return tips[category] || tips["Normal weight"];
  };

  const resetForm = () => {
    setFormData({
      weight: "",
      height: "",
      age: "",
      gender: "male",
      activityLevel: "moderate"
    });
    setShowResult(false);
    setBmiResult(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 className="section-title" style={{color: 'white', textAlign: 'center', marginBottom: '24px'}}>BMI Calculator & Exercise Planner</h1>
      
      <div className="card" style={{maxWidth: 900, marginTop: 12}}>
        <div className="card-body">
          <p style={{lineHeight: 1.8, marginBottom: 20}}>
            Calculate your BMI and get personalized exercise recommendations based on your fitness goals. 
            No login required - just enter your details and get started!
          </p>

          <form onSubmit={calculateBMI} style={{maxWidth: 600, display: 'grid', gap: 16}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Weight (kg) *
                </label>
                <input
                  className="input"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                  step="0.1"
                  required
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Height (cm) *
                </label>
                <input
                  className="input"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 170"
                  required
                />
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Age *
                </label>
                <input
                  className="input"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                  min="13"
                  max="100"
                  required
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Gender
                </label>
                <select
                  className="input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                Activity Level
              </label>
              <select
                className="input"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="very-active">Very Active (very hard exercise, physical job)</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: 12}}>
              <button className="btn" type="submit">
                Calculate BMI & Get Plan
              </button>
              {showResult && (
                <button className="btn-outline" type="button" onClick={resetForm}>
                  Calculate Again
                </button>
              )}
            </div>
          </form>

                               {showResult && bmiResult && (
            <div style={{
              marginTop: 32, 
              padding: 32, 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)', 
              borderRadius: 20, 
              backdropFilter: 'blur(20px)', 
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{textAlign: 'center', marginBottom: 32}}>
                <h2 style={{
                  margin: '0 0 24px 0', 
                  color: 'white', 
                  fontSize: '32px',
                  fontWeight: '800',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  🎯 Your BMI Results
                </h2>
                <div style={{
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: 24,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <div style={{
                    padding: '24px 20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-8px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                  }}>
                    <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>Your BMI</div>
                    <div style={{color: 'white', fontSize: '36px', fontWeight: '900', marginBottom: '4px'}}>{bmiResult.bmi}</div>
                    <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', fontWeight: '500'}}>Body Mass Index</div>
                  </div>
                  <div style={{
                    padding: '24px 20px', 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(240, 147, 251, 0.4)',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-8px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(240, 147, 251, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(240, 147, 251, 0.4)';
                  }}>
                    <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>Category</div>
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: bmiResult.category === 'Normal weight' ? 'rgba(220, 252, 231, 0.9)' : 
                                    bmiResult.category === 'Underweight' ? 'rgba(254, 243, 199, 0.9)' : 'rgba(254, 226, 226, 0.9)',
                      color: bmiResult.category === 'Normal weight' ? '#166534' : 
                             bmiResult.category === 'Underweight' ? '#92400e' : '#991b1b',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontWeight: '700',
                      fontSize: '18px',
                      marginTop: '8px'
                    }}>
                      {bmiResult.category}
                    </div>
                  </div>
                </div>
              </div>

                                           <div style={{marginBottom: 32}}>
                <h3 style={{
                  margin: '0 0 24px 0', 
                  color: 'white', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'center',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                  💪 Exercise Plan & Nutrition Tips
                </h3>
                <div style={{
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: 28,
                  maxWidth: '900px',
                  margin: '0 auto'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    padding: '24px', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h4 style={{
                      margin: '0 0 20px 0', 
                      color: 'white', 
                      fontSize: '20px',
                      fontWeight: '700',
                      textAlign: 'center',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      🏃‍♂️ Exercise Plan
                    </h4>
                    <div style={{display: 'grid', gap: '16px'}}>
                      <div style={{
                        padding: '16px', 
                        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 107, 107, 0.3)'
                      }}>
                        <div style={{color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px'}}>🏃‍♀️ Cardio</div>
                        <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px'}}>{bmiResult.exercisePlan.cardio}</div>
                      </div>
                      <div style={{
                        padding: '16px', 
                        background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(78, 205, 196, 0.1) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(78, 205, 196, 0.3)'
                      }}>
                        <div style={{color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px'}}>💪 Strength Training</div>
                        <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px'}}>{bmiResult.exercisePlan.strength}</div>
                      </div>
                      <div style={{
                        padding: '16px', 
                        background: 'linear-gradient(135deg, rgba(254, 202, 87, 0.2) 0%, rgba(254, 202, 87, 0.1) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(254, 202, 87, 0.3)'
                      }}>
                        <div style={{color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '16px'}}>🧘‍♀️ Flexibility</div>
                        <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px'}}>{bmiResult.exercisePlan.flexibility}</div>
                      </div>
                    </div>
                    
                    <div style={{marginTop: '20px'}}>
                      <h5 style={{
                        margin: '0 0 12px 0', 
                        color: 'rgba(255, 255, 255, 0.9)', 
                        fontSize: '16px',
                        fontWeight: '600',
                        textAlign: 'center',
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }}>
                        🎯 Key Recommendations
                      </h5>
                      <ul style={{
                        margin: 0, 
                        paddingLeft: 20, 
                        lineHeight: 1.6, 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                      }}>
                        {bmiResult.exercisePlan.recommendations.map((rec, index) => (
                          <li key={index} style={{
                            marginBottom: '8px',
                            padding: '8px 12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    padding: '24px', 
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h4 style={{
                      margin: '0 0 20px 0', 
                      color: 'white', 
                      fontSize: '20px',
                      fontWeight: '700',
                      textAlign: 'center',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      🥗 Nutrition Tips
                    </h4>
                    <ul style={{
                      margin: 0, 
                      paddingLeft: 0, 
                      lineHeight: 1.6, 
                      color: 'rgba(255, 255, 255, 0.9)',
                      listStyle: 'none'
                    }}>
                      {bmiResult.nutritionTips.map((tip, index) => (
                        <li key={index} style={{
                          marginBottom: '12px',
                          padding: '16px', 
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(0)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-3px)';
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)';
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <span style={{
                              fontSize: '20px',
                              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              {index + 1}
                            </span>
                            <span style={{
                              color: 'white', 
                              fontWeight: '600',
                              fontSize: '14px'
                            }}>
                              {tip}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 32,
                padding: 24,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  borderRadius: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span style={{fontSize: '20px'}}>💡</span>
                  <span style={{
                    color: 'white', 
                    fontSize: '16px', 
                    fontWeight: '700',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                  }}>
                    Important Note
                  </span>
                </div>
                <p style={{
                  margin: 0, 
                  fontSize: '15px', 
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  <strong style={{color: 'white'}}>This is a general guide.</strong> For personalized advice, 
                  consult with a healthcare professional or certified fitness trainer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
