import os
import json
import pathlib
import functions_framework
from dotenv import load_dotenv
from google.cloud import bigquery
from google.cloud import storage


load_dotenv(".env")
DATA_DIR = pathlib.Path(__file__).parent


public_bucket_name = os.getenv('PUBLIC_BUCKET')

derived_dataset_name = os.getenv('DATA_LAKE_DERIVED')
table_name = 'earthquake_by_continent'

query = f'''
SELECT * FROM {derived_dataset_name}.{table_name}
'''


@functions_framework.http
def export_all_earthquake_data(request):
    print("Loading Earthquake data...")

    prepared_filename = DATA_DIR / 'all_earthquakes.json'
    prepared_location = 'all_earthquakes/all_earthquakes.json'

    bigquery_client = bigquery.Client()
    result = bigquery_client.query_and_wait(query)

    with open(prepared_filename, 'w') as jsonfile:
      json.dump([
          dict(row.items()) 
          for row in result
        ], jsonfile)
      
    print(f'Processed data into {prepared_filename}')

    # Upload the prepared data to cloud storage
    
    storage_client = storage.Client()
    bucket = storage_client.bucket(public_bucket_name)

    prepared_blobname = (prepared_location)
    blob = bucket.blob(prepared_blobname)
    blob.upload_from_filename(prepared_filename)
    print(f'Uploaded {prepared_filename} to {public_bucket_name}')

    return 'Success'
