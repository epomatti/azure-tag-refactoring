import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { ResourceManagementClient } from "@azure/arm-resources";

require('dotenv').config()
const fs = require('fs');

const clientId = process.env["CLIENT_ID"];
const secret = process.env["APPLICATION_SECRET"];
const tenantId = process.env["TENANT_ID"];
const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const resourceGroup = process.env["RESOURCE_GROUP"]

let rawdata = fs.readFileSync('tags.json');
let tagConfig = JSON.parse(rawdata);

msRestNodeAuth.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  const client = new ResourceManagementClient(creds, subscriptionId);

  client.resourceGroups.get(resourceGroup).then(rg => {

    const tags = rg.tags;
    console.log(tags);

    const value = tags[tagConfig[0].deprecatedTag];
    tags[tagConfig[0].newTag] = value;
    delete tags[tagConfig[0].deprecatedTag];

    var parameters = { tags: tags };
    client.resourceGroups.update(resourceGroup, parameters).catch(err => {
      console.error(err);
    })

    console.log(tags);

  })
}).catch((err) => {
  console.error(err);
});