"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# ==========================================================
# ENDPOINTS DE AUTENTICACIÓN JWT
# ==========================================================

# 1. [POST] /api/signup - Registrar un nuevo usuario
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()

    # Validar que lleguen los campos obligatorios
    if not body or 'email' not in body or 'password' not in body:
        return jsonify({"msg": "El email y la contraseña son obligatorios"}), 400

    # Verificar si el usuario ya existe en la base de datos
    user_exists = User.query.filter_by(email=body['email']).first()
    if user_exists:
        return jsonify({"msg": "El correo electrónico ya está registrado"}), 400

    # Crear el nuevo usuario (por defecto activo/is_active=True)
    new_user = User(
        email=body['email'],
        password=body['password'],
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado con éxito. Por favor inicia sesión."}), 201


# 2. [POST] /api/login - Iniciar sesión y obtener Token JWT
@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()

    if not body or 'email' not in body or 'password' not in body:
        return jsonify({"msg": "El email y la contraseña son obligatorios"}), 400

    # Buscar al usuario en la base de datos
    user = User.query.filter_by(
        email=body['email'], password=body['password']).first()

    if user is None:
        return jsonify({"msg": "Correo electrónico o contraseña incorrectos"}), 401

    # Generar el Token de acceso JWT
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "msg": "Inicio de sesión exitoso",
        "token": access_token,
        "user_id": user.id
    }), 200


# 3. [GET] /api/private - Ruta protegida por JWT
@api.route('/private', methods=['GET'])
@jwt_required()
def handle_private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "msg": "Acceso concedido a la zona privada",
        "user": user.serialize()
    }), 200
