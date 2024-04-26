```shell
gcloud functions deploy join_earthquake_continent \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=earthquakers \
--source=. \
--entry-point=join_earthquake_continent \
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 \
--memory=8Gi \
--timeout=400s \
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' \
--trigger-http \
--no-allow-unauthenticated  
```
gcloud functions call join_earthquake_continent --project=earthquakers --region us-east1
