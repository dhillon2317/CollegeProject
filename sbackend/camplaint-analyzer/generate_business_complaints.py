import csv
import random
from datetime import datetime, timedelta

# Categories and their corresponding departments and types
categories = {
    'Billing': {'department': 'Billing', 'type': 'Non-Technical'},
    'Customer Service': {'department': 'Customer Support', 'type': 'Non-Technical'},
    'Product Quality': {'department': 'Quality Assurance', 'type': 'Technical'},
    'Shipping': {'department': 'Logistics', 'type': 'Non-Technical'},
    'Website Issues': {'department': 'IT', 'type': 'Technical'},
    'Account Access': {'department': 'IT', 'type': 'Technical'},
    'Returns': {'department': 'Customer Support', 'type': 'Non-Technical'},
    'Pricing': {'department': 'Sales', 'type': 'Non-Technical'},
    'Product Availability': {'department': 'Inventory', 'type': 'Non-Technical'},
    'Contract Issues': {'department': 'Legal', 'type': 'Non-Technical'},
    'Software Bugs': {'department': 'Development', 'type': 'Technical'},
    'Security Concerns': {'department': 'IT Security', 'type': 'Technical'},
    'Order Processing': {'department': 'Operations', 'type': 'Non-Technical'},
    'Data Privacy': {'department': 'Compliance', 'type': 'Technical'},
    'Service Outage': {'department': 'IT', 'type': 'Technical'}
}

# Complaint templates for each category
complaint_templates = {
    'Billing': [
        "I was charged incorrectly for {service} on my last invoice.",
        "There's a discrepancy in my billing for {product}.",
        "I was overcharged for {service} in my recent bill.",
        "The billing statement doesn't match our agreed pricing for {service}.",
        "I was double-charged for {product} on {date}."
    ],
    'Customer Service': [
        "The customer service representative was {behavior} when I called about {issue}.",
        "I've been waiting for {time} for a response to my inquiry about {issue}.",
        "The support team was unable to resolve my issue with {product}.",
        "I was transferred {number} times when trying to resolve my issue.",
        "The customer service regarding {issue} was unacceptable."
    ],
    'Product Quality': [
        "The {product} I received was {issue}.",
        "{product} stopped working after {time_period} of use.",
        "The quality of {product} does not meet the advertised specifications.",
        "I received a defective {product} on {date}.",
        "The {component} in {product} is not functioning as expected."
    ],
    'Shipping': [
        "My order #{order_number} is {days} days late.",
        "The shipping status for my order hasn't been updated in {days} days.",
        "I received the wrong item in my order #{order_number}.",
        "The packaging for {product} was damaged upon arrival.",
        "My order was marked as delivered but I never received it."
    ],
    'Website Issues': [
        "I'm unable to {action} on your website.",
        "The {feature} on your website is not working properly.",
        "I keep getting an error when trying to {action}.",
        "The website is very slow when {action}.",
        "I can't find {information} on your website."
    ],
    'Account Access': [
        "I'm unable to log in to my account.",
        "My account was locked after {number} failed login attempts.",
        "I'm not receiving password reset emails for my account.",
        "My account shows incorrect {information}.",
        "I need to update my account information but can't access the settings."
    ],
    'Returns': [
        "My return request for {product} hasn't been processed after {days} days.",
        "I was issued an incorrect refund amount for my return of {product}.",
        "The return shipping label provided was invalid.",
        "I was charged a restocking fee that wasn't mentioned in the return policy.",
        "The return process for {product} is too complicated."
    ],
    'Pricing': [
        "The price charged for {product} doesn't match the advertised price.",
        "I was charged {amount} more than the listed price for {product}.",
        "The discount code {code} didn't apply to my order.",
        "The final price at checkout was higher than shown in my cart.",
        "I was charged for shipping despite qualifying for free shipping."
    ],
    'Product Availability': [
        "{product} has been out of stock for {time_period}.",
        "The website showed {product} as in stock but my order was canceled.",
        "The estimated restock date for {product} keeps getting pushed back.",
        "I pre-ordered {product} but haven't received any updates.",
        "The product page doesn't show accurate stock levels for {product}."
    ],
    'Contract Issues': [
        "There's a discrepancy in our service contract regarding {term}.",
        "I was automatically renewed for a service I wanted to cancel.",
        "The terms of service were changed without proper notice.",
        "I'm having trouble terminating my contract for {service}.",
        "The contract doesn't specify {term} clearly."
    ],
    'Software Bugs': [
        "I found a bug in {software} when trying to {action}.",
        "The {feature} in {software} is not working as expected.",
        "{software} crashes when I {action}.",
        "The latest update to {software} caused {issue}.",
        "There's a display issue with {element} in {software}."
    ],
    'Security Concerns': [
        "I received a suspicious email that appears to be from your company.",
        "I noticed unusual activity in my account on {date}.",
        "Your website is not using HTTPS on the {page} page.",
        "I'm concerned about how my {data_type} is being stored and protected.",
        "I received a data breach notification from your company."
    ],
    'Order Processing': [
        "My order has been 'processing' for over {days} days.",
        "I received a confirmation email but my order doesn't appear in my account.",
        "The order status hasn't been updated in {days} days.",
        "I need to modify my order #{order_number} but can't find an option to do so.",
        "I was charged for my order but haven't received a confirmation."
    ],
    'Data Privacy': [
        "I want to request a copy of all data you have about me under GDPR.",
        "I noticed my personal information was shared without my consent.",
        "How is my {data_type} being used by your company?",
        "I want to delete my account and all associated data.",
        "I didn't consent to receive marketing emails from your partners."
    ],
    'Service Outage': [
        "{service} has been down for {hours} hours.",
        "I'm experiencing intermittent connectivity issues with {service}.",
        "The {feature} of {service} is not responding.",
        "I can't access {service} since {time}.",
        "There seems to be a widespread outage affecting {service}."
    ]
}

# Additional data for generating realistic complaints
behaviors = ['rude', 'unhelpful', 'dismissive', 'impatient', 'unprofessional']
products = ['laptop', 'smartphone', 'monitor', 'keyboard', 'software license', 'cloud storage', 'web hosting', 'premium account', 'subscription service']
services = ['cloud storage', 'web hosting', 'premium support', 'maintenance plan', 'consulting', 'training', 'API access']
issues = ['defective', 'damaged', 'not as described', 'missing parts', 'used when sold as new']
time_periods = ['a few days', 'one week', 'two weeks', 'a month', 'several months']
actions = ['checkout', 'log in', 'upload files', 'download reports', 'update my profile', 'place an order']
features = ['search function', 'checkout process', 'dashboard', 'reporting tool', 'mobile app']
software = ['CRM system', 'accounting software', 'inventory management', 'project management tool', 'analytics dashboard']
components = ['battery', 'screen', 'keyboard', 'power adapter', 'camera', 'microphone']
data_types = ['personal information', 'payment details', 'browsing history', 'usage data', 'contact information']

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
        if '{service}' in template:
            service = random.choice(services)
            template = template.replace('{service}', service)
        if '{product}' in template:
            product = random.choice(products)
            template = template.replace('{product}', product)
        if '{behavior}' in template:
            behavior = random.choice(behaviors)
            template = template.replace('{behavior}', behavior)
        if '{issue}' in template:
            issue = random.choice(issues)
            template = template.replace('{issue}', issue)
        if '{time_period}' in template:
            time_period = random.choice(time_periods)
            template = template.replace('{time_period}', time_period)
        if '{action}' in template:
            action = random.choice(actions)
            template = template.replace('{action}', action)
        if '{feature}' in template:
            feature = random.choice(features)
            template = template.replace('{feature}', feature)
        if '{software}' in template:
            software_choice = random.choice(software)
            template = template.replace('{software}', software_choice)
        if '{component}' in template:
            component = random.choice(components)
            template = template.replace('{component}', component)
        if '{data_type}' in template:
            data_type = random.choice(data_types)
            template = template.replace('{data_type}', data_type)
        if '{days}' in template:
            days = random.randint(1, 14)
            template = template.replace('{days}', str(days))
        if '{time}' in template:
            time = random_date().strftime('%I:%M %p')
            template = template.replace('{time}', time)
        if '{date}' in template:
            date = random_date().strftime('%B %d, %Y')
            template = template.replace('{date}', date)
        if '{order_number}' in template:
            order_number = random.randint(100000, 999999)
            template = template.replace('{order_number}', str(order_number))
        if '{number}' in template:
            number = random.randint(2, 5)
            template = template.replace('{number}', str(number))
        if '{amount}' in template:
            amount = f"${random.uniform(5.00, 100.00):.2f}"
            template = template.replace('{amount}', amount)
        if '{code}' in template:
            code = f"SAVE{random.randint(10, 50)}"
            template = template.replace('{code}', code)
        if '{term}' in template:
            terms = ['cancellation policy', 'refund terms', 'service level agreement', 'pricing structure', 'renewal terms']
            term = random.choice(terms)
            template = template.replace('{term}', term)
        if '{element}' in template:
            elements = ['navigation menu', 'checkout button', 'search bar', 'login form', 'product gallery']
            element = random.choice(elements)
            template = template.replace('{element}', element)
        if '{hours}' in template:
            hours = random.randint(1, 24)
            template = template.replace('{hours}', str(hours))
        if '{information}' in template:
            info = random.choice(['contact information', 'order history', 'account details', 'billing address', 'payment methods'])
            template = template.replace('{information}', info)
            
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
    if category in ['Security Concerns', 'Data Privacy', 'Service Outage']:
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
with open('business_complaints.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['complaint_text', 'category', 'priority', 'department', 'type']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    writer.writeheader()
    for complaint in complaints:
        # Remove the date field before writing to CSV
        complaint_copy = complaint.copy()
        complaint_copy.pop('date', None)
        writer.writerow(complaint_copy)

print("Generated 150 business complaints in business_complaints.csv")
