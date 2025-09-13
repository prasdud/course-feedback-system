import mongoengine as me
from user_accounts.models import User
# Create your models here.

class Course():
    name = me.StringField(required=True, max_length=200)
    description = me.StringField()

    meta = {
        'collection': 'courses'
    }

class Feedback(me.Document):
    student = me.ReferenceField(User, required=True)
    course = me.ReferenceField(Course, required=True)
    rating = me.IntField(min_value=1, max_value=5, required=True)
    message = me.StringField()
    created_at = me.DateTimeField(required=True)
    updated_at = me.DateTimeField()

    meta = {
        'collection': 'feedbacks'
    }