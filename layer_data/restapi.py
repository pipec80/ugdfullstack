from flask import Flask, Response, json, request
from pymongo import MongoClient
from bson.son import SON
app = Flask(__name__)

@app.route('/')
def api_root():
    """retorna todos los puntos de carga"""
    client = MongoClient()
    dbclient = client.bdpuntosCarga
    docs = list(dbclient.puntosCarga.find())
    resultset = json.dumps(docs)
    resp = Response(resultset, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa', methods = ['GET'])
def api_puntos():
    """retorna los puntos de carga segun los parametros latitude,longitude y radio"""
    latlag = request.args['P']
    radiorequest = request.args['R']

    latlagvalues = latlag.split(",")
    latitude = float(latlagvalues[0].replace("(", ""))
    longitude = float(latlagvalues[1].replace(")", ""))
    radius = int(radiorequest) / 6378.1

    client = MongoClient()
    dbclient = client.bdpuntosCarga
    #[ <longitude> , <latitude> ]
    query = {"location":{"$geoWithin":{"$centerSphere":[[longitude, latitude], radius]}}}
    data = list(dbclient.puntosCarga.find(query))
    resultset = json.dumps(data)
    resp = Response(resultset, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

if __name__ == '__main__':
    app.run(port=9000)
