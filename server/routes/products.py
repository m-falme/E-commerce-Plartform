from flask import Blueprint, jsonify, request
from models.product import Product
from extensions import db

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

print("Products route loaded")    