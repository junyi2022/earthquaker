

npx @google-cloud/functions-framework `
  --target manipulate_properties


gcloud functions deploy manipulate_properties `
--gen2 `
--region=us-east1 `
--runtime=nodejs20 `
--source=. `
--project=earthquakers `
--entry-point=manipulate_properties `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com `
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' `
--memory=4Gi `
--timeout=240s `
--no-allow-unauthenticated `
--trigger-http

# prepare step (change from geojson to jsonl)
functions-framework --debug `
  --target prepare_eq_data

gcloud functions deploy prepare_eq_data `
--gen2 `
--region=us-east1 `
--runtime=python312 `
--source=. `
--project=earthquakers `
--entry-point=prepare_eq_data `
--service-account=data-pipeline-robot-2024@earthquakers.iam.gserviceaccount.com `
--set-env-vars='DATA_LAKE_BUCKET=earthquakeclouddata' `
--memory=8Gi `
--timeout=480s `
--no-allow-unauthenticated `
--trigger-http


gcloud functions call prepare_eq_data --project=earthquakers --region=us-east1

gcloud functions logs read prepare_eq_data --project=earthquakers --region=us-east1

gcloud functions add-invoker-policy-binding prepare_eq_data `
--region="us-east1" `
--member="MEMBER_NAME"
