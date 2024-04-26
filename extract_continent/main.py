import pathlib
import requests
from google.cloud import storage
import os
import functions_framework

from dotenv import load_dotenv
load_dotenv()

DATA_DIR = pathlib.Path(__file__).parent


@functions_framework.http
def extract_continent_data(request):
    print('Downloading continent data...')
    url = ('https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/'
           'World_Continents/FeatureServer/0/query?outFields=*&where=1%3D1'
           '&f=geojson')
    filename = DATA_DIR / 'world_continent.geojson'

    response = requests.get(url)
    response.raise_for_status()

    with open(filename, 'wb') as f:
        f.write(response.content)

    print(f'Downloaded {filename}')

    # Upload the downloaded file to cloud storage
    bucket_name = os.getenv('DATA_LAKE_BUCKET')
    blob_name = 'raw/world_continent/world_continent.geojson'
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(filename)

    print(f'uploaded {blob_name} to {bucket_name}')
    return 'Success'