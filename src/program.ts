import { ResourceManagementClient, GenericResourceExpanded } from "@azure/arm-resources";
import Utils, { Config } from "./utils"

class Program {

    readonly utils: Utils;
    readonly config: Config;

    constructor() {
        this.utils = new Utils();
        this.config = this.utils.getConfig();
    }

    async replaceAllTags() {
        const subscriptions = this.config.subscriptions
        subscriptions.forEach(subscription => {
            this.utils.getArmClient(subscription.id).then(client => {
                this.refactorAllResourceGroups(client, subscription.rgs);
                this.refactorAllResources(client);
            })
        });
    }

    async refactorAllResources(client: ResourceManagementClient) {
        const resources = [];
        for await (const item of client.resources.list()) {
            resources.push(item);
        }
        resources.forEach(resource => {
            this.refactorResourceTags(client, resource);
        })
    }

    async refactorAllResourceGroups(client: ResourceManagementClient, rgs: string[]) {
        if (rgs) {
            rgs.forEach(rgId => {
                client.resourceGroups.get(rgId).then(rg => {
                    this.refactorResourceGroupTags(client, rg.name!, rg.tags);
                })
            })
        } else {
            const resourceGroups = [];
            for await (const item of client.resourceGroups.list()) {
                resourceGroups.push(item);
            }
            resourceGroups.forEach(rg => {
                this.refactorResourceGroupTags(client, rg.name!, rg.tags);
            })
        }
    }

    refactorResourceTags(client: ResourceManagementClient, resource: GenericResourceExpanded) {
        if (resource.tags) {
            const newTags = this.refactorTags(resource.tags);
            var parameters = { tags: newTags };
            client.resources.beginUpdateById(resource.id!, client.apiVersion, parameters).catch(err => {
                // TODO implement proper error treatment
                console.error(err);
            })
        }
    }

    refactorResourceGroupTags(client: ResourceManagementClient, name: string, tags: any) {
        if (tags) {
            const newTags = this.refactorTags(tags);
            var parameters = { tags: newTags };
            client.resourceGroups.update(name, parameters).catch(err => {
                // TODO implement proper error treatment
                console.error(err);
            })
        }
    }

    refactorTags(tags: any): any {
        this.config.tagSwitches.forEach(tagSwitch => {
            if (!tags[tagSwitch.newTag] || this.config.general.overrideExistingTag) {
                const value = tags[tagSwitch.tag];
                tags[tagSwitch.newTag] = value;
            }
            if (this.config.general.deleteTagsOnReplace) {
                delete tags[tagSwitch.tag];
            }
        })
        return tags;
    }
}

export default Program;