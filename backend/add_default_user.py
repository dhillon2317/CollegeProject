from app import app, db, User
from datetime import datetime

def create_default_user():
    with app.app_context():
        # Check if default user already exists
        default_user = User.query.filter_by(email='default@example.com').first()
        
        if not default_user:
            # Create default user
            default_user = User(
                username='default_user',
                email='default@example.com',
                password='default_password',  # In a real app, this should be hashed
                user_type='system',
                created_at=datetime.utcnow()
            )
            db.session.add(default_user)
            db.session.commit()
            print("Default user created successfully!")
        else:
            print("Default user already exists.")

if __name__ == '__main__':
    create_default_user()
