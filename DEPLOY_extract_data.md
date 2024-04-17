```shell
gcloud functions deploy extract_earthquake_data \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=earthquakers \
--source=. \
--entry-point=extract_earthquake_data \
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 \
--memory=4Gi \
--timeout=240s \
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' \
--trigger-http \
--no-allow-unauthenticated  
```
gcloud functions call extract_earthquake_data --project=earthquakers --region us-east1
