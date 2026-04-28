from flask import Flask
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from flask_cors import CORS
from extensions import db
from routes.auth import auth_bp   
from routes.products import products_bp
from routes.cart import cart_bp


load_dotenv()

jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})

    # CONFIG
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # EXTENSIONS
    db.init_app(app)
    jwt.init_app(app)

    migrate = Migrate(app, db)

    # BLUEPRINTS 
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(products_bp, url_prefix="/api/products")

    # TEST ROUTE
    @app.route("/")
    def home():
        return {"message": "API running successfully"}

    return app


app = create_app()
if __name__ == "__main__":
    app.run(debug=True)