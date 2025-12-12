import { useState } from "react";

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activityLevel: "moderate",
    dietaryPreference: "veg",
    goal: "lose", // lose, maintain, gain
    targetWeight: "",
    timeframe: "12" // weeks
  });
  
  const [calorieResult, setCalorieResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    
    if (!formData.age || !formData.weight || !formData.height || !formData.targetWeight) {
      alert("Please fill all required fields");
      return;
    }

    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const targetWeight = parseFloat(formData.targetWeight);
    const timeframe = parseInt(formData.timeframe);

    if (weight <= 0 || height <= 0 || age <= 0 || targetWeight <= 0) {
      alert("Please enter valid values");
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Apply activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel];

    // Calculate calorie needs based on goal
    let dailyCalories;
    let weeklyDeficit;
    let weeklyLoss;

    if (formData.goal === 'lose') {
      const weightDifference = weight - targetWeight;
      const totalDeficit = weightDifference * 7700; // 1 kg = 7700 calories
      weeklyDeficit = totalDeficit / timeframe;
      dailyCalories = tdee - (weeklyDeficit / 7);
      weeklyLoss = weeklyDeficit / 7700;
    } else if (formData.goal === 'gain') {
      const weightDifference = targetWeight - weight;
      const totalSurplus = weightDifference * 7700;
      weeklyDeficit = totalSurplus / timeframe;
      dailyCalories = tdee + (weeklyDeficit / 7);
      weeklyLoss = weeklyDeficit / 7700;
    } else {
      dailyCalories = tdee;
      weeklyDeficit = 0;
      weeklyLoss = 0;
    }

    // Get meal suggestions
    const mealPlan = getMealPlan(dailyCalories, formData.dietaryPreference, formData.goal);

    setCalorieResult({
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      weeklyDeficit: Math.round(weeklyDeficit),
      weeklyLoss: weeklyLoss.toFixed(2),
      mealPlan
    });
    setShowResult(true);
  };

  const getMealPlan = (dailyCalories, dietaryPreference, goal) => {
    const isVeg = dietaryPreference === 'veg';
    
    // Calculate macro distribution
    let proteinRatio, carbRatio, fatRatio;
    
    if (goal === 'lose') {
      proteinRatio = 0.35; // Higher protein for weight loss
      carbRatio = 0.35;
      fatRatio = 0.30;
    } else if (goal === 'gain') {
      proteinRatio = 0.25;
      carbRatio = 0.50; // Higher carbs for weight gain
      fatRatio = 0.25;
    } else {
      proteinRatio = 0.30;
      carbRatio = 0.40;
      fatRatio = 0.30;
    }

    const proteinGrams = Math.round((dailyCalories * proteinRatio) / 4);
    const carbGrams = Math.round((dailyCalories * carbRatio) / 4);
    const fatGrams = Math.round((dailyCalories * fatRatio) / 9);

    // Meal distribution
    const breakfast = Math.round(dailyCalories * 0.25);
    const lunch = Math.round(dailyCalories * 0.35);
    const dinner = Math.round(dailyCalories * 0.30);
    const snacks = Math.round(dailyCalories * 0.10);

    // Get food suggestions
    const foodSuggestions = getFoodSuggestions(dailyCalories, isVeg, goal);

    return {
      macros: { protein: proteinGrams, carbs: carbGrams, fat: fatGrams },
      meals: { breakfast, lunch, dinner, snacks },
      foodSuggestions
    };
  };

  const getFoodSuggestions = (dailyCalories, isVeg, goal) => {
    const suggestions = {
      breakfast: {
        veg: [
          { name: "Oats with milk & nuts", calories: 300, protein: "8g", carbs: "45g", fat: "12g" },
          { name: "Poha with vegetables", calories: 280, protein: "6g", carbs: "42g", fat: "8g" },
          { name: "Idli with sambar", calories: 250, protein: "7g", carbs: "38g", fat: "6g" },
          { name: "Besan chilla", calories: 320, protein: "12g", carbs: "35g", fat: "14g" },
          { name: "Sprouts salad", calories: 200, protein: "15g", carbs: "25g", fat: "5g" }
        ],
        nonveg: [
          { name: "Eggs with whole wheat bread", calories: 350, protein: "18g", carbs: "35g", fat: "14g" },
          { name: "Chicken sandwich", calories: 380, protein: "22g", carbs: "38g", fat: "16g" },
          { name: "Fish curry with rice", calories: 420, protein: "25g", carbs: "45g", fat: "18g" },
          { name: "Turkey wrap", calories: 320, protein: "20g", carbs: "30g", fat: "12g" }
        ]
      },
      lunch: {
        veg: [
          { name: "Dal khichdi with vegetables", calories: 450, protein: "16g", carbs: "65g", fat: "12g" },
          { name: "Rajma chawal", calories: 480, protein: "18g", carbs: "68g", fat: "14g" },
          { name: "Chana masala with roti", calories: 420, protein: "14g", carbs: "58g", fat: "16g" },
          { name: "Mixed vegetable curry with rice", calories: 400, protein: "12g", carbs: "62g", fat: "10g" },
          { name: "Paneer bhurji with roti", calories: 460, protein: "20g", carbs: "55g", fat: "18g" }
        ],
        nonveg: [
          { name: "Chicken curry with rice", calories: 520, protein: "28g", carbs: "65g", fat: "18g" },
          { name: "Fish curry with roti", calories: 480, protein: "25g", carbs: "58g", fat: "16g" },
          { name: "Mutton curry with rice", calories: 550, protein: "32g", carbs: "62g", fat: "22g" },
          { name: "Egg curry with roti", calories: 420, protein: "18g", carbs: "55g", fat: "14g" }
        ]
      },
      dinner: {
        veg: [
          { name: "Mixed dal with roti", calories: 380, protein: "14g", carbs: "52g", fat: "12g" },
          { name: "Vegetable pulao", calories: 420, protein: "10g", carbs: "68g", fat: "14g" },
          { name: "Mushroom curry with rice", calories: 360, protein: "12g", carbs: "58g", fat: "10g" },
          { name: "Lentil soup with bread", calories: 320, protein: "16g", carbs: "45g", fat: "8g" }
        ],
        nonveg: [
          { name: "Grilled chicken with vegetables", calories: 380, protein: "32g", carbs: "25g", fat: "16g" },
          { name: "Fish tikka with salad", calories: 320, protein: "28g", carbs: "18g", fat: "14g" },
          { name: "Lean meat curry with roti", calories: 420, protein: "25g", carbs: "45g", fat: "18g" }
        ]
      },
      snacks: {
        veg: [
          { name: "Mixed nuts (30g)", calories: 180, protein: "6g", carbs: "8g", fat: "16g" },
          { name: "Fruits (apple/banana)", calories: 80, protein: "1g", carbs: "18g", fat: "0g" },
          { name: "Roasted chana", calories: 120, protein: "6g", carbs: "18g", fat: "4g" },
          { name: "Greek yogurt", calories: 100, protein: "15g", carbs: "8g", fat: "2g" }
        ],
        nonveg: [
          { name: "Boiled eggs (2)", calories: 140, protein: "12g", carbs: "2g", fat: "10g" },
          { name: "Tuna sandwich", calories: 200, protein: "18g", carbs: "25g", fat: "6g" },
          { name: "Chicken soup", calories: 120, protein: "15g", carbs: "8g", fat: "4g" }
        ]
      }
    };

    return suggestions;
  };

  const resetForm = () => {
    setFormData({
      age: "",
      gender: "male",
      weight: "",
      height: "",
      activityLevel: "moderate",
      dietaryPreference: "veg",
      goal: "lose",
      targetWeight: "",
      timeframe: "12"
    });
    setShowResult(false);
    setCalorieResult(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 className="section-title" style={{color: 'white', textAlign: 'center', marginBottom: '24px'}}>Calorie Deficit Calculator & Meal Planner</h1>
      
      <div className="card" style={{maxWidth: 1000, marginTop: 12}}>
        <div className="card-body">
          <p style={{lineHeight: 1.8, marginBottom: 20}}>
            Calculate your daily calorie needs and get personalized meal suggestions based on your fitness goals. 
            Choose between vegetarian and non-vegetarian options for customized nutrition plans.
          </p>

          <form onSubmit={calculateCalories} style={{maxWidth: 800, display: 'grid', gap: 16}}>
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
                </select>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Current Weight (kg) *
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
                  Target Weight (kg) *
                </label>
                <input
                  className="input"
                  type="number"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  placeholder="e.g., 65"
                  step="0.1"
                  required
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Timeframe (weeks)
                </label>
                <select
                  className="input"
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleInputChange}
                >
                  <option value="8">8 weeks</option>
                  <option value="12">12 weeks</option>
                  <option value="16">16 weeks</option>
                  <option value="20">20 weeks</option>
                </select>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
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
              
              <div>
                <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                  Dietary Preference
                </label>
                <select
                  className="input"
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleInputChange}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>
                Goal
              </label>
              <select
                className="input"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: 12}}>
              <button className="btn" type="submit">
                Calculate Calories & Get Meal Plan
              </button>
              {showResult && (
                <button className="btn-outline" type="button" onClick={resetForm}>
                  Calculate Again
                </button>
              )}
            </div>
          </form>

                     {showResult && calorieResult && (
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
                   🎯 Your Personalized Calorie Plan
                 </h2>
                 <div style={{
                   display: 'grid', 
                   gridTemplateColumns: 'repeat(3, 1fr)', 
                   gap: 20,
                   maxWidth: '700px',
                   margin: '0 auto'
                 }}>
                   <div style={{
                     padding: '24px 16px', 
                     background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                     borderRadius: '16px',
                     boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer'
                   }}
                  //  onMouseOver={(e) => {
                  //    e.target.style.transform = 'translateY(-8px)';
                  //    e.target.style.boxShadow = '0 15px 35px rgba(240, 147, 251, 0.6)';
                  //  }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.4)';
                   }}>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>Daily Need</div>
                     <div style={{color: 'white', fontSize: '28px', fontWeight: '900', marginBottom: '4px'}}>{calorieResult.tdee}</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500'}}>calories</div>
                   </div>
                   <div style={{
                     padding: '24px 16px', 
                     background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                     borderRadius: '16px',
                     boxShadow: '0 8px 25px rgba(79, 172, 254, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-8px)';
                     e.target.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.6)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.4)';
                   }}>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>Daily Target</div>
                     <div style={{color: 'white', fontSize: '28px', fontWeight: '900', marginBottom: '4px'}}>{calorieResult.dailyCalories}</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500'}}>calories</div>
                   </div>
                   <div style={{
                     padding: '24px 16px', 
                     background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                     borderRadius: '16px',
                     boxShadow: '0 8px 25px rgba(250, 112, 154, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-8px)';
                     e.target.style.boxShadow = '0 15px 35px rgba(250, 112, 154, 0.6)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(250, 112, 154, 0.4)';
                   }}>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>Weekly {formData.goal === 'lose' ? 'Loss' : formData.goal === 'gain' ? 'Gain' : 'Change'}</div>
                     <div style={{color: 'white', fontSize: '28px', fontWeight: '900', marginBottom: '4px'}}>{calorieResult.weeklyLoss}</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', fontWeight: '500'}}>kg</div>
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
                   🥗 Macro Distribution
                 </h3>
                 <div style={{
                   display: 'grid', 
                   gridTemplateColumns: 'repeat(3, 1fr)', 
                   gap: 24,
                   maxWidth: '600px',
                   margin: '0 auto'
                 }}>
                   <div style={{
                     padding: '24px 20px', 
                     background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                     borderRadius: '20px',
                     textAlign: 'center',
                     boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px) scale(1.02)';
                     e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.6)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0) scale(1)';
                     e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.4)';
                   }}>
                     <div style={{
                       position: 'absolute',
                       top: '-20px',
                       right: '-20px',
                       width: '40px',
                       height: '40px',
                       background: 'rgba(255, 255, 255, 0.2)',
                       borderRadius: '50%'
                     }}></div>
                     <div style={{color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.macros.protein}g</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: '600'}}>Protein</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '4px'}}>Muscle Building</div>
                   </div>
                   <div style={{
                     padding: '24px 20px', 
                     background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                     borderRadius: '20px',
                     textAlign: 'center',
                     boxShadow: '0 10px 30px rgba(78, 205, 196, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px) scale(1.02)';
                     e.target.style.boxShadow = '0 15px 40px rgba(78, 205, 196, 0.6)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0) scale(1)';
                     e.target.style.boxShadow = '0 10px 30px rgba(78, 205, 196, 0.4)';
                   }}>
                     <div style={{
                       position: 'absolute',
                       top: '-20px',
                       right: '-20px',
                       width: '40px',
                       height: '40px',
                       background: 'rgba(255, 255, 255, 0.2)',
                       borderRadius: '50%'
                     }}></div>
                     <div style={{color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.macros.carbs}g</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: '600'}}>Carbs</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '4px'}}>Energy Source</div>
                   </div>
                   <div style={{
                     padding: '24px 20px', 
                     background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
                     borderRadius: '20px',
                     textAlign: 'center',
                     boxShadow: '0 10px 30px rgba(254, 202, 87, 0.4)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px) scale(1.02)';
                     e.target.style.boxShadow = '0 15px 40px rgba(254, 202, 87, 0.6)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0) scale(1)';
                     e.target.style.boxShadow = '0 10px 30px rgba(254, 202, 87, 0.4)';
                   }}>
                     <div style={{
                       position: 'absolute',
                       top: '-20px',
                       right: '-20px',
                       width: '40px',
                       height: '40px',
                       background: 'rgba(255, 255, 255, 0.2)',
                       borderRadius: '50%'
                     }}></div>
                     <div style={{color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.macros.fat}g</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: '600'}}>Fat</div>
                     <div style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '4px'}}>Essential Nutrients</div>
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
                   🍽️ Daily Meal Distribution
                 </h3>
                 <div style={{
                   display: 'grid', 
                   gridTemplateColumns: 'repeat(4, 1fr)', 
                   gap: 20,
                   maxWidth: '800px',
                   margin: '0 auto'
                 }}>
                   <div style={{
                     padding: '20px 16px', 
                     background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                     borderRadius: '18px',
                     textAlign: 'center',
                     boxShadow: '0 8px 25px rgba(168, 237, 234, 0.3)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     border: '2px solid rgba(255, 255, 255, 0.2)'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px)';
                     e.target.style.boxShadow = '0 12px 35px rgba(168, 237, 234, 0.5)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(168, 237, 234, 0.3)';
                   }}>
                     <div style={{color: '#2c3e50', fontSize: '24px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.meals.breakfast}</div>
                     <div style={{color: '#34495e', fontSize: '14px', fontWeight: '600'}}>Breakfast</div>
                     <div style={{color: '#7f8c8d', fontSize: '11px', marginTop: '4px'}}>25% of daily</div>
                   </div>
                   <div style={{
                     padding: '20px 16px', 
                     background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                     borderRadius: '18px',
                     textAlign: 'center',
                     boxShadow: '0 8px 25px rgba(255, 236, 210, 0.3)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     border: '2px solid rgba(255, 255, 255, 0.2)'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px)';
                     e.target.style.boxShadow = '0 12px 35px rgba(255, 236, 210, 0.5)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(255, 236, 210, 0.3)';
                   }}>
                     <div style={{color: '#2c3e50', fontSize: '24px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.meals.lunch}</div>
                     <div style={{color: '#34495e', fontSize: '14px', fontWeight: '600'}}>Lunch</div>
                     <div style={{color: '#7f8c8d', fontSize: '11px', marginTop: '4px'}}>35% of daily</div>
                   </div>
                   <div style={{
                     padding: '20px 16px', 
                     background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                     borderRadius: '18px',
                     textAlign: 'center',
                     boxShadow: '0 8px 25px rgba(210, 153, 194, 0.3)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     border: '2px solid rgba(255, 255, 255, 0.2)'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px)';
                     e.target.style.boxShadow = '0 12px 35px rgba(210, 153, 194, 0.5)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(210, 153, 194, 0.3)';
                   }}>
                     <div style={{color: '#2c3e50', fontSize: '24px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.meals.dinner}</div>
                     <div style={{color: '#34495e', fontSize: '14px', fontWeight: '600'}}>Dinner</div>
                     <div style={{color: '#7f8c8d', fontSize: '11px', marginTop: '4px'}}>30% of daily</div>
                   </div>
                   <div style={{
                     padding: '20px 16px', 
                     background: 'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
                     borderRadius: '18px',
                     textAlign: 'center',
                     boxShadow: '0 8px 25px rgba(168, 202, 186, 0.3)',
                     transform: 'translateY(0)',
                     transition: 'all 0.3s ease',
                     cursor: 'pointer',
                     border: '2px solid rgba(255, 255, 255, 0.2)'
                   }}
                   onMouseOver={(e) => {
                     e.target.style.transform = 'translateY(-5px)';
                     e.target.style.boxShadow = '0 12px 35px rgba(168, 202, 186, 0.5)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'translateY(0)';
                     e.target.style.boxShadow = '0 8px 25px rgba(168, 202, 186, 0.3)';
                   }}>
                     <div style={{color: '#2c3e50', fontSize: '24px', fontWeight: '900', marginBottom: '8px'}}>{calorieResult.mealPlan.meals.snacks}</div>
                     <div style={{color: '#34495e', fontSize: '14px', fontWeight: '600'}}>Snacks</div>
                     <div style={{color: '#7f8c8d', fontSize: '11px', marginTop: '4px'}}>10% of daily</div>
                   </div>
                 </div>
               </div>

                             <div>
                 <h3 style={{
                   margin: '0 0 24px 0', 
                   color: 'white', 
                   fontSize: '24px',
                   fontWeight: '700',
                   textAlign: 'center',
                   textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                 }}>
                   🍴 Meal Suggestions ({formData.dietaryPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'})
                 </h3>
                 <div style={{
                   display: 'grid', 
                   gridTemplateColumns: 'repeat(2, 1fr)', 
                   gap: 28,
                   maxWidth: '900px',
                   margin: '0 auto'
                 }}>
                   {Object.entries(calorieResult.mealPlan.foodSuggestions).map(([mealType, foods]) => (
                     <div key={mealType} style={{
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
                         textTransform: 'capitalize',
                         fontSize: '20px',
                         fontWeight: '700',
                         textAlign: 'center',
                         padding: '12px 20px',
                         background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                         borderRadius: '12px',
                         border: '1px solid rgba(255, 255, 255, 0.3)'
                       }}>
                         {mealType === 'breakfast' ? '🌅' : mealType === 'lunch' ? '🌞' : mealType === 'dinner' ? '🌙' : '🍎'} {mealType}
                       </h4>
                       <div style={{display: 'grid', gap: '12px'}}>
                         {foods[formData.dietaryPreference].slice(0, 3).map((food, index) => (
                           <div key={index} style={{
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
                               color: 'white', 
                               fontWeight: '700', 
                               marginBottom: '8px',
                               fontSize: '16px',
                               textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                             }}>
                               {food.name}
                             </div>
                             <div style={{
                               color: 'rgba(255, 255, 255, 0.9)', 
                               fontSize: '13px',
                               display: 'grid',
                               gridTemplateColumns: 'repeat(4, 1fr)',
                               gap: '8px',
                               textAlign: 'center'
                             }}>
                               <div style={{
                                 padding: '4px 8px',
                                 background: 'rgba(255, 107, 107, 0.3)',
                                 borderRadius: '6px',
                                 fontSize: '11px'
                               }}>
                                 {food.calories} cal
                               </div>
                               <div style={{
                                 padding: '4px 8px',
                                 background: 'rgba(255, 107, 107, 0.3)',
                                 borderRadius: '6px',
                                 fontSize: '11px'
                               }}>
                                 P: {food.protein}
                               </div>
                               <div style={{
                                 padding: '4px 8px',
                                 background: 'rgba(78, 205, 196, 0.3)',
                                 borderRadius: '6px',
                                 fontSize: '11px'
                               }}>
                                 C: {food.carbs}
                               </div>
                               <div style={{
                                 padding: '4px 8px',
                                 background: 'rgba(254, 202, 87, 0.3)',
                                 borderRadius: '6px',
                                 fontSize: '11px'
                               }}>
                                 F: {food.fat}
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
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
                   <strong style={{color: 'white'}}>This is a general guide.</strong> For personalized nutrition advice, 
                   consult with a registered dietitian or nutritionist. Adjust portions based on your hunger levels and activity.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
