import os
from dotenv import load_dotenv
from mongoengine import connect, Document, StringField

# Load .env
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv('DB_URI')
connect(host=MONGO_URI)

# Define a test model
class TestUser(Document):
    name = StringField(required=True)

# Create and save a document
user = TestUser(name="MongoEngine Test")
user.save()

# Fetch from DB
for u in TestUser.objects():
    print(u.name)
