from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.cart import CartItem

cart_bp = Blueprint("cart", __name__)

# ADD TO CART
@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()

    item = CartItem(
        user_id=user_id,
        product_id=data["product_id"],
        quantity=data.get("quantity", 1)
    )

    db.session.add(item)
    db.session.commit()

    return jsonify(item.to_dict()), 201


# GET USER CART
@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()

    items = CartItem.query.filter_by(user_id=user_id).all()

    return jsonify([item.to_dict() for item in items])