from pymongo import MongoClient
import requests
import json
client = MongoClient()
db = client.bdpuntosCarga

def consumeGETRequestSync():
    url = 'http://datos.gob.cl/api/action/datastore_search?resource_id=ba0cd493-8bec-4806-91b5-4c2b5261f65e'
    headers = {"Accept": "application/json"}
    response = requests.get(url)
    data = response.json()
    records = list(data['result']['records'])
    for entry in data['result']['records']:
       cmd = entry
       cmd['location'] = {"coordinates":[cmd['LONGITUD'],cmd['LATITUD']],"type":"Point"} # “longitude, latitude.”
       print (cmd)

    #LONGITUD LATITUD
    #print (records)
    #result = db.puntosCarga.insert_many(records)
    #print ('puntos cargados',db.puntosCarga.count())
consumeGETRequestSync()