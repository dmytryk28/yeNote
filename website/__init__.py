from flask import Flask
from secret import secret_key


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = secret_key

    from .views import views
    app.register_blueprint(views, url_prefix='/')

    return app
