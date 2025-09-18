import joblib
import os

# --- Step 1: Load All Trained Models ---
MODELS_DIR = 'models'

try:
    print("Loading models...")
    category_model = joblib.load(os.path.join(MODELS_DIR, 'category_model.pkl'))
    priority_model = joblib.load(os.path.join(MODELS_DIR, 'priority_model.pkl'))
    type_model = joblib.load(os.path.join(MODELS_DIR, 'type_model.pkl'))
    department_model = joblib.load(os.path.join(MODELS_DIR, 'department_model.pkl'))
    print("Models loaded successfully!")
except FileNotFoundError:
    print("Error: Model files not found. Please run train.py first.")
    exit()

# --- Step 2: Apni Complaint Yahan Likhein ---
# Aap is line ko badal kar koi bhi nayi complaint test kar sakte hain
new_complaint = "The internet is very slow in the library and the website is not opening."

# --- Step 3: Models se Prediction Karein ---
# Complaint ko list mein daalna zaroori hai kyunki model list of inputs leta hai
complaint_to_predict = [new_complaint]

predicted_category = category_model.predict(complaint_to_predict)[0]
predicted_priority = priority_model.predict(complaint_to_predict)[0]
predicted_type = type_model.predict(complaint_to_predict)[0]
predicted_department = department_model.predict(complaint_to_predict)[0]

# Confidence Score (Optional, but good to have)
category_confidence = category_model.predict_proba(complaint_to_predict).max() * 100

# --- Step 4: Result Print Karein ---
print("\n" + "="*30)
print("      COMPLAINT ANALYSIS")
print("="*30)
print(f"Complaint Text: '{new_complaint}'")
print("-" * 30)
print(f"Predicted Category   : {predicted_category}")
print(f"Predicted Priority   : {predicted_priority}")
print(f"Predicted Type       : {predicted_type}")
print(f"Assigned Department  : {predicted_department}")
print(f"AI Confidence        : {category_confidence:.2f}%")
print("="*30)

