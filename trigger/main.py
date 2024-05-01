from dotenv import load_dotenv
import functions_framework
from datetime import datetime
import pandas as pd
from google.cloud import bigquery
load_dotenv()


@functions_framework.http
def invoke_trigger(request):
    client = bigquery.Client()
    filename_query = """
            SELECT *, _FILE_NAME
            FROM `earthquakers.data_lake.history_earthquakes`
        """
    filename_df = client.query_and_wait(filename_query).to_dataframe()
    filename_df['date_str'] = filename_df['_FILE_NAME'].str.extract(
        r'(\d{4}-\d{2}-\d{2})')
    filename_df['date'] = pd.to_datetime(filename_df['date_str'])
    most_recent_date = filename_df['date'].max()
    # Getting today's date
    today = datetime.today().date()
    days_difference = (today - most_recent_date.date()).days
    if days_difference > 30:
        print("True")
        trigger = "1"
    else:
        print("False")
        trigger = "0"

    return trigger
