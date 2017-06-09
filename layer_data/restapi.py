from flask import Flask, url_for, Response, json, request
from pymongo import MongoClient
app = Flask(__name__)

@app.route('/')
def api_root():
    client = MongoClient()
    db = client.bdpuntosCarga
    cursor = db.puntosCarga.find({})
    docs = list(db.puntosCarga.find())
   
    js = json.dumps(docs)
    resp = Response(js, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa', methods = ['GET'])
def api_puntos():
    #client = MongoClient()
    #db = client.bdpuntosCarga
    latlag = request.args['P']
    radio = request.args['R']
    data = {
        'p'  : latlag,
        'radio' : radio
    }
    js = json.dumps(data)
    resp = Response(js, status=201, mimetype='application/json')
    resp.headers['Link'] = 'http://server'
    return resp

@app.route('/puntoventa/<puntoventaid>')
def api_article(puntoventaid):
    return 'You are reading ' + puntoventaid

if __name__ == '__main__':
    app.run( port=9000)