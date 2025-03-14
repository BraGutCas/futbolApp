from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = 'cff73a88fa8a02f7260ff8ea04b50b64'  # Asegúrate de usar tu API KEY válida
BASE_URL = 'https://v3.football.api-sports.io/'

# Los IDs de las 5 grandes ligas de Europa
EUROPEAN_LEAGUES = [39, 140, 135, 78, 61]

# Ruta para obtener las ligas disponibles (filtrado solo a las grandes ligas)
@app.route('/api/leagues', methods=['GET'])
def get_leagues():
    url = f'{BASE_URL}leagues'
    headers = {'x-rapidapi-key': API_KEY}
    
    try:
        # Realizamos la solicitud a la API externa para obtener las ligas
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            # Filtramos solo las ligas de las 5 grandes ligas
            filtered_leagues = [league for league in data['response'] if league['league']['id'] in EUROPEAN_LEAGUES]
            return jsonify({'response': filtered_leagues})  # Retornamos las ligas filtradas al frontend
        else:
            return jsonify({'error': 'Error al obtener ligas'}), 500
    except Exception as e:
        print("Error al hacer la solicitud a la API:", e)  # Depuración
        return jsonify({'error': 'Error en la conexión con la API'}), 500

# Ruta para obtener los partidos basados en liga y temporada
@app.route('/api/football-matches', methods=['GET'])
def get_football_matches():
    league = request.args.get('league')
    season = request.args.get('season')

    if not league or not season:
        return jsonify({'error': 'Se requiere liga y temporada'}), 400

    url = f'{BASE_URL}fixtures'
    headers = {'x-rapidapi-key': API_KEY}
    params = {'league': league, 'season': season}
    
    try:
        # Realizamos la solicitud para obtener los partidos
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)  # Retornamos los partidos al frontend
        else:
            return jsonify({'error': 'Error al obtener partidos'}), 500
    except Exception as e:
        print("Error al hacer la solicitud a la API:", e)  # Depuración
        return jsonify({'error': 'Error en la conexión con la API'}), 500

if __name__ == '__main__':
    app.run(debug=True)
