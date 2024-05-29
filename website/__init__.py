from flask import Flask
from pymongo import MongoClient
from secret import secret_key, db_password

client = MongoClient(
    f'mongodb+srv://yenote05:{db_password}@yenote.epwf1qh.mongodb.net/?retryWrites=true&w=majority&appName=yeNote')
yenote_db = client.yenote


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = secret_key
    # print(client.list_database_names())
    # print(yenote_db.list_collection_names())
    # create_user()
    from .views import views
    from .controllers.user_controller import user_blueprint
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(user_blueprint, url_prefix='/api/v1/users')
    return app


def create_user():
    collection = yenote_db.user
    test_doc = {
        "name": "Yeva",
        "surname": "Adam"
    }
    collection.insert_one(test_doc)
