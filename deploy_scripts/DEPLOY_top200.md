```shell
gcloud functions deploy load_top_earthquakes \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=earthquakers \
--source=. \
--entry-point=load_top_earthquakes \
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 \
--memory=8Gi \
--timeout=480s \
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata','DATA_LAKE_DATASET=data_lake','DATA_LAKE_CORE=core' \
--trigger-http \
--no-allow-unauthenticated  
```
gcloud functions call load_top_earthquakes --project=earthquakers --region us-east1
functions-framework --target load_top_earthquakes --debug