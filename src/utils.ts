import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { ResourceManagementClient } from "@azure/arm-resources";
const fs = require('fs');

require('dotenv').config()

const clientId = process.env["CLIENT_ID"];
const secret = process.env["APPLICATION_SECRET"];
const tenantId = process.env["TENANT_ID"];
const configPath = process.env["CONFIG_JSON_PATH"];

export interface Config {
    general: { deleteTagsOnReplace: boolean; overrideExistingTag: boolean };
    tagSwitches: { tag: string, newTag: string }[];
    subscriptions: { id: string, rgs: string[] }[];
}

export class Utils {
    getConfig(): Config {
        let rawdata = fs.readFileSync(configPath);
        return JSON.parse(rawdata);
    }

    getArmClient = async (subscriptionId: string): Promise<ResourceManagementClient> => {
        return msRestNodeAuth.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
            return new ResourceManagementClient(creds, subscriptionId);
        });
    }
}

export default Utils