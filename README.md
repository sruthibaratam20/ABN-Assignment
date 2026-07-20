# DMP Azure DevOps Infrastructure & Data Engineering Assessment - Complete Solution

1. CI/CD Pipeline (build, test, deploy) for a "Hello World" web app
2. ARM template deployment (VNet, Resource Group, App Service) integrated into the same pipeline

Everything below is written so you can do it in order and finish quickly, using only Azure's free tier.

---

## STEP 1 — Set up your Azure free account (or ABN AMRO sandbox)

1. Go to `https://azure.microsoft.com/free/` and sign up (or log in to the ABN AMRO sandbox/Dev environment if you already have access, since the assessment note says current employees should use that instead).
2. Free tier gives $200 credit for 30 days + 12 months of free services. The App Service Plan `F1` tier used in the ARM template below is **always free**, so you won't burn credit just by leaving it running (but still delete it when done, as instructed).

---

## STEP 2 — Set up Azure DevOps

1. Go to `https://dev.azure.com` and sign in with the same Microsoft account.
2. Create a new **Organization** (if you don't have one) and then a new **Project** (e.g. `DMP-Assessment`).
3. Go to **Repos** and push this entire `dmp-assessment` folder to the repo:
   ```bash
   cd dmp-assessment
   git init
   git remote add origin <your-azure-devops-repo-url>
   git add .
   git commit -m "Initial commit - Hello World app + ARM template + pipeline"
   git push -u origin main
   ```

---

## STEP 3 — Create the Service Connection (so the pipeline can talk to Azure)

1. In your Azure DevOps project, go to **Project Settings → Service connections → New service connection**.
2. Choose **Azure Resource Manager → Service principal (automatic)**.
3. Select your subscription, leave resource group blank (we want subscription scope so the pipeline can create the resource group itself), and name it exactly:
   ```
   dmp-azure-service-connection
   ```
   (This name must match the `azureSubscription` variable in `azure-pipelines.yml`. Change one or the other if you use a different name.)
4. Grant access permission to all pipelines when prompted.

---

## STEP 4 — Understand the ARM template (Task 3 & 4 of the assignment)

`arm-template/azuredeploy.json` deploys, inside one Resource Group:

| Resource | Purpose |
|---|---|
| `Microsoft.Network/virtualNetworks` | The VNet (satisfies "create a Virtual Network") |
| `Microsoft.Web/serverfarms` | App Service Plan (Free `F1` tier) |
| `Microsoft.Web/sites` | The Web App itself (satisfies "VM or App Service" — App Service is simpler and free, so it's used here instead of a VM) |

You can deploy this manually first (recommended, so you understand it before the pipeline runs it):

```bash
az login
az group create --name dmp-assessment-rg --location centralindia

az deployment group create \
  --resource-group dmp-assessment-rg \
  --template-file arm-template/azuredeploy.json \
  --parameters arm-template/azuredeploy.parameters.json
```

If this succeeds manually, your pipeline's ARM deployment stage will work too.

---

## STEP 6 — Understand the pipeline (Task 1 & 2 of the assignment)

`azure-pipelines.yml` has 4 stages, matching exactly what the assignment asks for:

1. **Build** — installs npm dependencies, zips the app into an artifact
2. **Test** — runs `npm test` (mocha + supertest tests in `test/server.test.js`)
3. **DeployInfra** — runs the ARM template deployment (creates VNet + App Service)
4. **DeployApp** — deploys Hello World app onto the App Service just created

This structure directly demonstrates: pipeline configuration, build agents, test integration, ARM/IaC deployment, and deployment to an Azure service — i.e. everything listed under "Skills Assessed" in both tasks.

---

## STEP 7 — Create the Pipeline in Azure DevOps

1. In Azure DevOps, go to **Pipelines → New Pipeline**.
2. Choose **Azure Repos Git** → select your repo.
3. Choose **Existing Azure Pipelines YAML file** → select `/azure-pipelines.yml`.
4. Click **Run**.

The first run will ask you to authorize the pipeline to use the service connection and to create the `dmp-assessment-env` environment — click **Permit/Approve** when prompted.

---

## STEP 8 — Verify

1. Watch the 4 stages go green in the Azure DevOps pipeline run view.
2. Once `DeployApp` finishes, go to the Azure Portal → your Resource Group → the Web App → click the URL. You should see:
   ```
   Hello World - DMP Azure DevOps Assessment
   ```

---

## STEP 9 — Cleanup (required by the assignment note)

Once you've captured screenshots/evidence of success, delete everything to avoid any charges or sandbox usage issues:

```bash
az group delete --name dmp-assessment-rg --yes --no-wait
```

Or in the portal: Resource Groups → `dmp-assessment-rg` → **Delete resource group**.

---

## Reference documentation (as given in the assignment)

- Azure docs: `https://learn.microsoft.com/en-us/azure/?product=popular`
- Azure DevOps pipelines: `https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops`
