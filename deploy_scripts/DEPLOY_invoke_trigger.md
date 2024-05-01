```shell
gcloud functions deploy invoke_trigger \
--gen2 \
--region=us-east1 \
--runtime=python312 \
--project=earthquakers \
--source=. \
--entry-point=invoke_trigger \
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com	 \
--memory=8Gi \
--timeout=400s \
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' \
--trigger-http \
--no-allow-unauthenticated  
```
gcloud functions call invoke_trigger --project=earthquakers --region us-east1