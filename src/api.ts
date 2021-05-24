import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { ResourceManagementClient } from "@azure/arm-resources";

require('dotenv').config()

const clientId = process.env["CLIENT_ID"];
const secret = process.env["APPLICATION_SECRET"];
const tenantId = process.env["TENANT_ID"];

export const getClient = async (subscriptionId: string): Promise<ResourceManagementClient> => {
    return msRestNodeAuth.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
        return new ResourceManagementClient(creds, subscriptionId);
    });
}