Detects date changes on [Pixiv Illustrations Daily Rankings](https://www.pixiv.net/ranking.php?mode=daily&content=illust)
and starts pipeline execution when changes are detected.

Runs on Google Cloud Function.

Triggered by Google Cloud Scheduler.

### Deployment

1. Create a new service account with `Cloud Functions Invoker` role

2. Copy and save `Trigger URL`

3. Select `App Engine default service account` under `Service account`

4. Add `API_URL`, `PROJECT`, `ZONE`, `INSTANCE_NAME` under `Environment variables` with configurations of the instance running the pipeline

5. Select `Python 3.7` under `Runtime`, specify `main` under `Entry point`

6. Copy code to `main.py` and dependencies to `requirements.txt`, then deploy

7. In Cloud Scheduler, create a new job and copy the `Trigger URL` to under `URL` and specify `GET` under `HTTP method`

8. Use `5 * * * *` as frequency

9. Specify `Add OIDC token` under `Auth header` and use the created service account as `Service account`
