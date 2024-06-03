from flask import Flask
from pymongo import MongoClient
from secret import secret_key, db_password

client = MongoClient(
    f'mongodb+srv://yenote05:{db_password}@yenote.epwf1qh.mongodb.net/?retryWrites=true&w=majority&appName=yeNote')
yenote_db = client.yenote


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = secret_key
    from .views import views
    from .controllers.user_controller import user_blueprint
    from .controllers.task_controller import task_blueprint
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(user_blueprint, url_prefix='/api/v1/users')
    app.register_blueprint(task_blueprint, url_prefix='/api/v1/tasks')
    return app
