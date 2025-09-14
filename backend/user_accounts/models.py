import mongoengine as me
from cloudinary.models import CloudinaryField
# Create your models here.



class User(me.Document):
    name = me.StringField(required = True, max_length=100)
    email = me.EmailField(required = True, unique=True)
    password = me.StringField(required = True, min_length=8)
    ROLE_CHOICES = [('admin', 'admin'), ('student', 'student')]
    role = me.StringField(required = True, choices=ROLE_CHOICES, default='student')
    #profile_picture = CloudinaryField('profile_picture', blank=True, null=True)
    profile_picture = me.StringField(max_length=500)
    phone = me.StringField(max_length=15)
    dob = me.DateTimeField()
    address = me.StringField(max_length=300)
    is_blocked = me.BooleanField(default=False)

    #mongoDB collection name
    meta = {
        'collection': 'users'
    }