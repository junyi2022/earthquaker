import pathlib
import requests
from google.cloud import storage
import os
import functions_framework

from dotenv import load_dotenv
load_dotenv()

DATA_DIR = pathlib.Path(__file__).parent


@functions_framework.http
def extract_earthquake_data(request):
    print('Downloading earthquake data...')
    url = ('https://earthquake.usgs.gov/earthquakes/feed/v1.0/'
           'summary/all_month.geojson')
    filename = DATA_DIR / 'past_month_earthquakes.geojson'

    response = requests.get(url)
    response.raise_for_status()

    with open(filename, 'wb') as f:
        f.write(response.content)

    print(f'Downloaded {filename}')

    # Upload the downloaded file to cloud storage
    bucket_name = os.getenv('DATA_LAKE_BUCKET')
    blob_name = 'raw/past_month_eq/past_month_earthquakes.geojson'
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(filename)

    print(f'uploaded {blob_name} to {bucket_name}')
    return 'Success'
