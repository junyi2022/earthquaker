import json
import pathlib
import os
import datetime as dt
from google.cloud import storage
import functions_framework

from dotenv import load_dotenv
load_dotenv()

DIRNAME = pathlib.Path(__file__).parent

today_date = dt.date.today().isoformat()

@functions_framework.http
def prepare_earthquake_data(request):
    raw_filename = DIRNAME / 'past_month_earthquakes_withlatlon.geojson'
    prepared_filename = DIRNAME / f'past_month_earthquakes_withlatlon_{today_date}.jsonl'
    prepared_location = f'prepared/past_month_eq/past_month_earthquakes_withlatlon_{today_date}.jsonl'

    bucket_name = os.getenv('DATA_LAKE_BUCKET')
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    # Download the data from cloud storage
    raw_blobname = ('raw/past_month_eq/'
                    'past_month_earthquakes_withlatlon.geojson')
    blob = bucket.blob(raw_blobname)
    blob.download_to_filename(raw_filename)
    print(f'Downloaded {raw_filename}')

    # Load the data from the GeoJSON file
    with open(raw_filename, 'r', encoding='utf-8') as f:
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
    prepared_blobname = (prepared_location)
    blob = bucket.blob(prepared_blobname)
    blob.upload_from_filename(prepared_filename)
    print(f'Uploaded {prepared_filename} to {bucket_name}')
    return 'Success'
