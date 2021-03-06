from pymongo import MongoClient
import requests

def load_datastore():
    """consumo la data desde la api"""
    client = MongoClient()
    dbclient = client.bdpuntosCarga
    dbclient.puntosCarga.remove({})
    dbclient.puntosCarga.create_index([("location", "2dsphere")])
    url = "http://datos.gob.cl/api/action/datastore_search" \
            "?resource_id=ba0cd493-8bec-4806-91b5-4c2b5261f65e"
    response = requests.get(url)
    data = response.json()

    for entry in data['result']['records']:
        cmd = entry
        cmd['location'] = {
            "coordinates":[float(cmd['LONGITUD']), float(cmd['LATITUD'])], "type":"Point"
        }
        dbclient.puntosCarga.insert(cmd)

    print('puntos cargados', dbclient.puntosCarga.count())
load_datastore()
