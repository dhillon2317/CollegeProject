import csv
import random
from datetime import datetime, timedelta

# Categories and their corresponding departments and types
categories = {
    'Wait Times': {'department': 'Emergency Room', 'type': 'Non-Technical'},
    'Staff Behavior': {'department': 'Nursing', 'type': 'Non-Technical'},
    'Billing': {'department': 'Billing', 'type': 'Non-Technical'},
    'Doctor Consultation': {'department': 'General Practice', 'type': 'Non-Technical'},
    'Cleanliness': {'department': 'Housekeeping', 'type': 'Non-Technical'},
    'Appointment': {'department': 'Specialty Care', 'type': 'Non-Technical'},
    'Privacy': {'department': 'Reception', 'type': 'Non-Technical'},
    'Insurance': {'department': 'Insurance', 'type': 'Non-Technical'},
    'Follow-up Care': {'department': 'Patient Care', 'type': 'Non-Technical'},
    'Accessibility': {'department': 'Facilities', 'type': 'Non-Technical'},
    'Medication': {'department': 'Pharmacy', 'type': 'Technical'},
    'Equipment': {'department': 'Radiology', 'type': 'Technical'},
    'Food Service': {'department': 'Food Service', 'type': 'Non-Technical'},
    'Scheduling': {'department': 'General Practice', 'type': 'Non-Technical'},
    'IT Issues': {'department': 'IT', 'type': 'Technical'},
    'Parking': {'department': 'Facilities', 'type': 'Non-Technical'},
    'Facilities': {'department': 'Maintenance', 'type': 'Technical'},
    'Patient Education': {'department': 'Nursing', 'type': 'Non-Technical'}
}

# Complaint templates for each category
complaint_templates = {
    'Wait Times': [
        "Waited for over {hours} hours in the {department} before being seen by a doctor.",
        "The wait time for {department} is unreasonably long.",
        "Spent {hours} hours in the waiting room at {department}."
    ],
    'Staff Behavior': [
        "The {staff} was very {behavior} during my visit.",
        "{staff} at the {department} were {behavior} when I needed help.",
        "I received {behavior} treatment from the {staff}."
    ],
    'Billing': [
        "I was overcharged for my recent {procedure}.",
        "There was an error in my medical bill for {service}.",
        "The hospital charged me twice for the same {procedure}."
    ],
    'Doctor Consultation': [
        "The doctor didn't explain my {condition} properly.",
        "I felt rushed during my consultation about {condition}.",
        "The doctor didn't listen to my concerns about {symptom}."
    ],
    'Cleanliness': [
        "The {area} was not clean during my visit.",
        "I noticed {issue} in the {area}.",
        "The hospital {area} was in an unsanitary condition."
    ],
    'Appointment': [
        "I couldn't get an appointment with a {specialist} for {time}.",
        "My appointment with {specialist} was canceled without notice.",
        "The earliest available appointment is in {time} which is too long to wait."
    ],
    'Privacy': [
        "The {staff} discussed my medical information where others could hear.",
        "I noticed a breach of my medical privacy regarding my {condition}.",
        "My medical records were not handled confidentially at the {department}."
    ],
    'Insurance': [
        "My insurance claim for {procedure} was wrongfully denied.",
        "The hospital doesn't accept my {insurance} insurance.",
        "There was a problem with the insurance pre-authorization for my {procedure}."
    ],
    'Follow-up Care': [
        "No one followed up after my {procedure} to check on my recovery.",
        "I haven't received my test results from {time} ago.",
        "The post-operative care instructions were not clear after my {procedure}."
    ],
    'Accessibility': [
        "The {entrance/area} is not wheelchair accessible.",
        "There are no {accommodations} for patients with {disability}.",
        "The hospital is not accessible for people with {disability}."
    ],
    'Medication': [
        "I was prescribed the wrong {medication} for my {condition}.",
        "The pharmacy was out of my prescribed {medication}.",
        "I experienced severe side effects from {medication} that weren't explained."
    ],
    'Equipment': [
        "The {equipment} was not working during my appointment.",
        "The {equipment} in the {department} needs maintenance.",
        "The hospital needs to upgrade their {equipment} in {department}."
    ],
    'Food Service': [
        "The hospital food was {quality} and {taste}.",
        "My dietary restrictions for {diet} were not accommodated.",
        "The food service hours are not convenient for patients."
    ],
    'Scheduling': [
        "The doctor was {time} late for my appointment.",
        "My appointment was rescheduled {number} times without my consent.",
        "The clinic doesn't have any available appointments for {time}."
    ],
    'IT Issues': [
        "I can't access my {records} online.",
        "The hospital's online portal is not working properly.",
        "I'm having trouble logging into my patient account."
    ],
    'Parking': [
        "The hospital parking lot is always full.",
        "The parking fees at the hospital are too expensive.",
        "There's no designated parking for {type} patients."
    ],
    'Facilities': [
        "The {facility} in my room was not working.",
        "The hospital needs better {facility} in the {area}.",
        "The {facility} in the {department} is outdated."
    ],
    'Patient Education': [
        "I wasn't given enough information about my {condition}.",
        "The discharge instructions were not clear about {topic}.",
        "I need more education about managing my {condition}."
    ]
}

# Additional data for generating realistic complaints
staff_types = ['nurse', 'doctor', 'receptionist', 'technician', 'pharmacist', 'therapist']
behaviors = ['rude', 'dismissive', 'unprofessional', 'inattentive', 'impatient']
procedures = ['blood test', 'X-ray', 'MRI scan', 'surgery', 'ultrasound', 'biopsy', 'colonoscopy']
conditions = ['diabetes', 'hypertension', 'asthma', 'arthritis', 'migraine', 'allergies', 'back pain']
symptoms = ['headache', 'fever', 'nausea', 'dizziness', 'pain', 'fatigue']
areas = ['restroom', 'waiting room', 'patient room', 'hallway', 'cafeteria', 'emergency room']
specialists = ['cardiologist', 'dermatologist', 'neurologist', 'orthopedist', 'oncologist']
medications = ['antibiotics', 'painkillers', 'antidepressants', 'blood pressure medication', 'insulin']
equipment = ['MRI machine', 'X-ray machine', 'ultrasound machine', 'EKG machine', 'blood pressure monitor']
qualities = ['cold', 'bland', 'undercooked', 'overcooked', 'stale']
tastes = ['tasteless', 'salty', 'sweet', 'spicy', 'bland']
diets = ['vegetarian', 'vegan', 'gluten-free', 'diabetic', 'low-sodium']
disabilities = ['mobility issues', 'visual impairment', 'hearing impairment', 'wheelchair users']
facilities = ['air conditioning', 'heating', 'lighting', 'elevator', 'bathroom', 'TV', 'phone']

# Generate a random date within the last 6 months
def random_date():
    end = datetime.now()
    start = end - timedelta(days=180)
    return start + (end - start) * random.random()

# Generate a complaint
def generate_complaint():
    category = random.choice(list(categories.keys()))
    dept = categories[category]['department']
    complaint_type = categories[category]['type']
    
    # Select a random template for the category
    template = random.choice(complaint_templates[category])
    
    # Fill in the template with appropriate values
    try:
        if '{hours}' in template:
            hours = random.randint(1, 6)
            complaint = template.replace('{hours}', str(hours)).replace('{department}', dept)
        elif '{staff}' in template:
            staff = random.choice(staff_types)
            behavior = random.choice(behaviors)
            complaint = template.replace('{staff}', staff).replace('{behavior}', behavior).replace('{department}', dept)
        elif '{procedure}' in template:
            procedure = random.choice(procedures)
            complaint = template.replace('{procedure}', procedure)
        elif '{condition}' in template:
            condition = random.choice(conditions)
            complaint = template.replace('{condition}', condition)
        elif '{symptom}' in template:
            symptom = random.choice(symptoms)
            complaint = template.replace('{symptom}', symptom)
        elif '{area}' in template:
            area = random.choice(areas)
            issue = random.choice(['dirty', 'messy', 'cluttered', 'in disarray'])
            complaint = template.replace('{area}', area).replace('{issue}', issue)
        elif '{specialist}' in template or '{time}' in template:
            specialist = random.choice(specialists)
            time = random.choice(['2 weeks', '1 month', '3 months', '6 months'])
            complaint = template.replace('{specialist}', specialist).replace('{time}', time)
        elif '{medication}' in template:
            medication = random.choice(medications)
            complaint = template.replace('{medication}', medication).replace('{condition}', random.choice(conditions))
        elif '{equipment}' in template:
            equipment_choice = random.choice(equipment)
            complaint = template.replace('{equipment}', equipment_choice).replace('{department}', dept)
        elif '{quality}' in template and '{taste}' in template:
            quality = random.choice(qualities)
            taste = random.choice(tastes)
            complaint = template.replace('{quality}', quality).replace('{taste}', taste)
        elif '{diet}' in template:
            diet = random.choice(diets)
            complaint = template.replace('{diet}', diet)
        elif '{facility}' in template:
            facility = random.choice(facilities)
            area = random.choice(areas)
            complaint = template.replace('{facility}', facility).replace('{area}', area).replace('{department}', dept)
        else:
            complaint = template
    except Exception as e:
        # Fallback to a simple complaint if there's an error
        complaint = f"Issue with {category.lower()} in {dept} department"
    
    # Random priority (weighted towards Medium)
    priority = random.choices(
        ['Low', 'Medium', 'High'],
        weights=[0.2, 0.6, 0.2],
        k=1
    )[0]
    
    # For certain categories, make priority more likely to be High
    if category in ['Medication', 'Equipment', 'Privacy']:
        priority = random.choices(
            ['Low', 'Medium', 'High'],
            weights=[0.1, 0.3, 0.6],
            k=1
        )[0]
    
    return {
        'complaint_text': complaint,
        'category': category,
        'priority': priority,
        'department': dept,
        'type': complaint_type,
        'date': random_date().strftime('%Y-%m-%dT%H:%M:%S.000Z')
    }

# Generate 150 complaints
complaints = [generate_complaint() for _ in range(150)]

# Sort complaints by date
complaints.sort(key=lambda x: x['date'])

# Write to CSV
with open('healthcare_complaints_large.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['complaint_text', 'category', 'priority', 'department', 'type']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for complaint in complaints:
        # Remove the date field before writing to CSV
        complaint_copy = complaint.copy()
        complaint_copy.pop('date', None)
        writer.writerow(complaint_copy)

print("Generated 150 healthcare complaints in healthcare_complaints_large.csv")
