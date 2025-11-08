import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

print("Training script started...")

# --- Step 1: Load Data ---
print("Loading complaint datasets...")

# List all CSV files in the directory
complaint_files = [
    'complaints.csv',
    'healthcare_complaints.csv',
    'business_complaints.csv'
]

# Initialize an empty list to store dataframes
dfs = []

# Load each CSV file if it exists
for file in complaint_files:
    file_path = os.path.join(os.path.dirname(__file__), file)
    if os.path.exists(file_path):
        try:
            temp_df = pd.read_csv(file_path)
            # Ensure required columns exist
            required_columns = ['complaint_text', 'category', 'priority', 'type', 'department']
            if all(col in temp_df.columns for col in required_columns):
                temp_df.dropna(subset=required_columns, inplace=True)
                dfs.append(temp_df)
                print(f"Loaded {len(temp_df)} complaints from {file}")
            else:
                print(f"Skipping {file}: Missing required columns")
        except Exception as e:
            print(f"Error loading {file}: {str(e)}")

if not dfs:
    raise ValueError("No valid complaint data found. Please ensure at least one valid CSV file exists.")

# Combine all dataframes
df = pd.concat(dfs, ignore_index=True)
print(f"Successfully loaded {len(df)} total complaints from {len(dfs)} dataset(s).")

X = df['complaint_text']

# --- Step 2: Train Category Model ---
print("\n--- Training Category Model ---")
y_category = df['category']
X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(X, y_category, test_size=0.2, random_state=42)
category_model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2))),
    ('clf', MultinomialNB(alpha=0.1)),
])
category_model.fit(X_train_cat, y_train_cat)
y_pred_cat = category_model.predict(X_test_cat)
print(f"Category Model Accuracy: {accuracy_score(y_test_cat, y_pred_cat):.2f}")


# --- Step 3: Train Priority Model ---
print("\n--- Training Priority Model ---")
y_priority = df['priority']
X_train_pri, X_test_pri, y_train_pri, y_test_pri = train_test_split(X, y_priority, test_size=0.2, random_state=42)
priority_model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2))),
    ('clf', MultinomialNB(alpha=0.5)),
])
priority_model.fit(X_train_pri, y_train_pri)
y_pred_pri = priority_model.predict(X_test_pri)
print(f"Priority Model Accuracy: {accuracy_score(y_test_pri, y_pred_pri):.2f}")


# --- Step 4: Train Type Model ---
print("\n--- Training Type Model ---")
y_type = df['type']
X_train_type, X_test_type, y_train_type, y_test_type = train_test_split(X, y_type, test_size=0.2, random_state=42)
type_model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2))),
    ('clf', MultinomialNB(alpha=0.5)),
])
type_model.fit(X_train_type, y_train_type)
y_pred_type = type_model.predict(X_test_type)
print(f"Type Model Accuracy: {accuracy_score(y_test_type, y_pred_type):.2f}")


# --- Step 5: Train Department Model (YAHAN NAYA CODE ADD HUA HAI) ---
print("\n--- Training Department Model ---")
y_department = df['department']
X_train_dept, X_test_dept, y_train_dept, y_test_dept = train_test_split(X, y_department, test_size=0.2, random_state=42)
department_model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1,2))),
    ('clf', MultinomialNB(alpha=0.1)),
])
department_model.fit(X_train_dept, y_train_dept)
y_pred_dept = department_model.predict(X_test_dept)
print(f"Department Model Accuracy: {accuracy_score(y_test_dept, y_pred_dept):.2f}")


# --- Step 6: Save All Models ---
MODELS_DIR = 'models'
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

joblib.dump(category_model, os.path.join(MODELS_DIR, 'category_model.pkl'))
joblib.dump(priority_model, os.path.join(MODELS_DIR, 'priority_model.pkl'))
joblib.dump(type_model, os.path.join(MODELS_DIR, 'type_model.pkl'))
joblib.dump(department_model, os.path.join(MODELS_DIR, 'department_model.pkl')) # Naya model save karein

print(f"\nAll 4 models saved successfully in '{MODELS_DIR}' folder.")
print("Training script finished.")
