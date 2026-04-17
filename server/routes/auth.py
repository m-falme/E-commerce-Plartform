from flask import Blueprint, request, jsonify
from app import db
from models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)