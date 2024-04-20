import json
import pathlib
import os
from google.cloud import storage
import functions_framework

from dotenv import load_dotenv
load_dotenv()

DIRNAME = pathlib.Path(__file__).parent


@functions_framework.http
def prepare_continent_data(request):
    raw_filename = DIRNAME / 'world_continent.geojson'
    prepared_filename = DIRNAME / 'world_continent.jsonl'

    bucket_name = os.getenv('DATA_LAKE_BUCKET')
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Download the data from cloud storage
    raw_blobname = 'raw/world_continent/world_continent.geojson'
    blob = bucket.blob(raw_blobname)
    blob.download_to_filename(raw_filename)
    print(f'Downloaded {raw_filename}')

    # Load the data from the GeoJSON file
    with open(raw_filename, 'r') as f:
        data = json.load(f)

    # Write the data to a JSONL file
    with open(prepared_filename, 'w') as f:
        for feature in data['features']:
            row = feature['properties']
            row['geog'] = (
                json.dumps(feature['geometry'])
                if feature['geometry'] and feature['geometry']['coordinates']
                else None
            )
            f.write(json.dumps(row) + '\n')

    print(f'Processed data into {prepared_filename}')

    # Upload the prepared data to cloud storage
    prepared_blobname = 'prepared/world_continent/world_continent.jsonl'
    blob = bucket.blob(prepared_blobname)
    blob.upload_from_filename(prepared_filename)
    print(f'Uploaded {prepared_filename} to {bucket_name}')
    return 'Success'
