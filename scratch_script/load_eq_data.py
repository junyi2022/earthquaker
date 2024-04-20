import os
from google.cloud import bigquery
from dotenv import load_dotenv
load_dotenv()

bucket_name = os.getenv('DATA_LAKE_BUCKET')
dataset_name = os.getenv('DATA_LAKE_DATASET')

# Load the data into BigQuery as an external table
prepared_blobname = ('prepared/world_continent/world_continent.jsonl')
table_name = 'world_continent'
table_uri = f'gs://{bucket_name}/{prepared_blobname}'

create_table_query = f'''
CREATE OR REPLACE EXTERNAL TABLE {dataset_name}.{table_name}
OPTIONS (
  format = 'JSON',
  uris = ['{table_uri}']
)
'''

bigquery_client = bigquery.Client()
bigquery_client.query_and_wait(create_table_query)
print(f'Loaded {table_uri} into {dataset_name}.{table_name}')
