from flask import Flask, request, jsonify
import pickle, numpy as np
from flask_cors import CORS #Conexion con otras servicios

app = Flask(__name__)
CORS(app)

# Cargar los tres modelos
models = {
    'baby': pickle.load(open('models/nili_baby_model.pkl', 'rb')),
    'kid': pickle.load(open('models/nili_kid_model.pkl', 'rb')),
    'adult': pickle.load(open('models/nili_adult_model.pkl', 'rb'))
}
#Dfinimos un endpoint de la API 
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    num1, op, num2, level = data['num1'], data['op'], data['num2'], data['level']

    op_map = {'+': 0, '-': 1, '*': 2}
    X = np.array([[num1, num2, op_map[op]]])

    # Seleccionar el modelo correcto según el nivel
    model = models.get(level, models['baby'])
    y_pred = model.predict(X)[0]

    return jsonify({'answer': int(y_pred)})

if __name__ == '__main__':
    app.run()
