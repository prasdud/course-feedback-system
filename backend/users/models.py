import mongoengine as me
# Create your models here.



class User(me.Document):
    name = me.StringField(required = True, max_length=100)
    email = me.EmailField(required = True, unique=True)
    password = me.StringField(required = True, min_length=8)
    ROLE_CHOICES = [('admin', 'admin'), ('student', 'student')]
    role = me.StringField(required = True, choices=ROLE_CHOICES, default='student')


    #mongoDB collection name
    meta = {
        'collection': 'users'
    }