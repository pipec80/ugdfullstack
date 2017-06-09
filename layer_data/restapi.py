from flask import Flask, Response, json, request
from pymongo import MongoClient
from bson.son import SON
app = Flask(__name__)

@app.route('/')
def api_root():
    client = MongoClient()
    db = client.bdpuntosCarga
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

    client = MongoClient()
    dbclient = client.bdpuntosCarga
    query = {"location": SON([("$near", [longitude, latitude]), ("$maxDistance", 10000)])}
    data  = list(dbclient.puntosCarga.find(query))
    js = json.dumps(data)
    resp = Response(js, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa/<puntoventaid>')
def api_article(puntoventaid):
    return 'You are reading ' + puntoventaid

if __name__ == '__main__':
    app.run(port=9000)
