import { ResourceManagementClient } from "@azure/arm-resources";
import { DefaultAzureCredential } from "@azure/identity";
const fs = require('fs');

require('dotenv').config()

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
        const credentials = new DefaultAzureCredential();
        return new ResourceManagementClient(credentials, subscriptionId);
    }
}

export default Utils