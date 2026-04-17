from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from models import db

load_dotenv()

jwt = JWTManager()


def create_app():

    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    db.init_app(app)
    jwt.init_app(app)

    @app.route("/")
    def home():
        return {"message": "API running successfully"}

    return app


app = create_app()