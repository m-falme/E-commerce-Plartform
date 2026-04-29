from extensions import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))  
    category = db.Column(db.String(100))   
    stock = db.Column(db.Integer, default=0) 
    cart_items = db.relationship("CartItem", backref="product", lazy=True)  # ← ADD


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "image_url": self.image_url,
            "category": self.category,
            "stock": self.stock
        }