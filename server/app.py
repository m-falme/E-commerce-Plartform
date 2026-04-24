from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from flask_cors import CORS
from models import db
from routes.auth import auth_bp   

load_dotenv()

jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    migrate = Migrate(app, db)

    # ---------------- CONFIG ----------------
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # ---------------- EXTENSIONS ----------------
    db.init_app(app)
    jwt.init_app(app)

    # ---------------- BLUEPRINTS ----------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # ---------------- TEST ROUTE ----------------
    @app.route("/")
    def home():
        return {"message": "API running successfully"}

    return app


app = create_app()
if __name__ == "__main__":
    app.run(debug=True)