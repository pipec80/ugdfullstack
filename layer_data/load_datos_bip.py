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
    records = data['result']['records']
    #print (records)
    db.puntosCarga.count()
consumeGETRequestSync()