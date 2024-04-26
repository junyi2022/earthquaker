import os
import pathlib
import functions_framework
from dotenv import load_dotenv
from google.cloud import bigquery


load_dotenv(".env")
DATA_DIR = pathlib.Path(__file__).parent

bucket_name = os.getenv('DATA_LAKE_BUCKET')
dataset_name = os.getenv('DATA_LAKE_DATASET')
core_dataset_name = os.getenv('DATA_LAKE_CORE')
prepared_blobname = ('prepared/past_month_eq/*.jsonl')
table_name = 'history_earthquakes'
table_uri = f'gs://{bucket_name}/{prepared_blobname}'

create_table_query = f'''
CREATE OR REPLACE EXTERNAL TABLE {dataset_name}.{table_name}
OPTIONS (
  format = 'JSON',
  uris = ['{table_uri}']
)
'''

create_core_table_query = f'''
CREATE OR REPLACE TABLE {core_dataset_name}.{table_name}
CLUSTER BY (geog)
AS (
  SELECT *
  FROM {dataset_name}.{table_name}
)
'''


@functions_framework.http
def load_earthquake_data(request):
    print("Loading Earthquake data...")

    bigquery_client = bigquery.Client()
    bigquery_client.query_and_wait(create_table_query)
    bigquery_client.query_and_wait(create_core_table_query)

    return 'Success'
