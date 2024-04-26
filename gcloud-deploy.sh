# local run local
# python
functions-framework --debug `
  --target load_earthquake_data
# javascript
npx @google-cloud/functions-framework `
  --target manipulate_properties

# deploy step
# manipulate properties step
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


# local run cloud
gcloud functions call prepare_eq_data --project=earthquakers --region=us-east1

gcloud functions call manipulate_properties --project=earthquakers --region=us-east1

gcloud functions logs read prepare_eq_data --project=earthquakers --region=us-east1

