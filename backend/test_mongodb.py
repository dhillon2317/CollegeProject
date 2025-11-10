from pymongo import MongoClient
from urllib.parse import quote_plus
import ssl

print("Testing MongoDB Connection...")
print(f"Python SSL version: {ssl.OPENSSL_VERSION}")

username = "dhillon2317"
password = "dhillon1000"
cluster = "cluster0.6ebj5lk.mongodb.net"

encoded_username = quote_plus(username)
encoded_password = quote_plus(password)

# Try different connection methods

print("\n1. Testing with tlsAllowInvalidCertificates...")
try:
    mongo_uri = f"mongodb+srv://{encoded_username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000,
        tls=True,
        tlsAllowInvalidCertificates=True
    )
    client.server_info()
    print("✅ SUCCESS with tlsAllowInvalidCertificates!")
    db = client['complaints_db']
    collection = db['complaints']
    count = collection.count_documents({})
    print(f"Found {count} complaints in database")
    client.close()
except Exception as e:
    print(f"❌ FAILED: {e}")

print("\n2. Testing with tlsInsecure...")
try:
    mongo_uri = f"mongodb+srv://{encoded_username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority"
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000,
        tlsInsecure=True
    )
    client.server_info()
    print("✅ SUCCESS with tlsInsecure!")
    db = client['complaints_db']
    collection = db['complaints']
    count = collection.count_documents({})
    print(f"Found {count} complaints in database")
    client.close()
except Exception as e:
    print(f"❌ FAILED: {e}")

print("\n3. Testing without SSL options...")
try:
    mongo_uri = f"mongodb+srv://{encoded_username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority"
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    client.server_info()
    print("✅ SUCCESS without SSL options!")
    db = client['complaints_db']
    collection = db['complaints']
    count = collection.count_documents({})
    print(f"Found {count} complaints in database")
    client.close()
except Exception as e:
    print(f"❌ FAILED: {e}")

print("\nDone!")
