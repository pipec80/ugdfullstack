from flask import Flask, Response, json, request
from pymongo import MongoClient
app = Flask(__name__)

@app.route('/')
def api_root():
    client = MongoClient()
    db = client.bdpuntosCarga
    cursor = db.puntosCarga.find()
    docs = list(db.puntosCarga.find())
    js = json.dumps(docs)
    resp = Response(js, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa', methods = ['GET'])
def api_puntos():
    latlag = request.args['P']
    radio = request.args['R']
    #[ <longitude> , <latitude> ]
    latlagvalues = latlag.split(",")
    latitude = float(latlagvalues[0].replace("(", ""))
    longitude = float(latlagvalues[1].replace(")", ""))
    data = {
        "latitude" : latitude,
        "longitude" : longitude
    }
    client = MongoClient()
    db = client.bdpuntosCarga

    js = json.dumps(data)
    resp = Response(js, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa/<puntoventaid>')
def api_article(puntoventaid):
    return 'You are reading ' + puntoventaid

if __name__ == '__main__':
    app.run(port=9000)
