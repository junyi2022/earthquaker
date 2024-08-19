from dotenv import load_dotenv
import pandas_gbq
import functions_framework
from google.cloud import bigquery
load_dotenv()


@functions_framework.http
def load_top_earthquakes(request):
    client = bigquery.Client()
    eq_query = """
        CREATE OR REPLACE TABLE `earthquakers.derived.top_200` AS
        SELECT *
        FROM `earthquakers.derived.earthquake_by_continent`
        WHERE CONTINENT != 'Sea'
        ORDER BY mag DESC
        LIMIT 200"""
    earthquake = client.query_and_wait(eq_query).to_dataframe()
    pandas_gbq.to_gbq(earthquake, 'derived.top_200',
                      project_id="earthquakers", if_exists='replace')
    return 'Success'
