import { ResourceManagementClient } from "@azure/arm-resources";
import { GenericResourceExpanded } from "@azure/arm-resources/esm/models";
import Utils, { Config } from "./utils"

class Program {

    readonly utils: Utils;
    readonly config: Config;

    constructor() {
        this.utils = new Utils();
        this.config = this.utils.getConfig();
    }

    replaceAllTags() {
        const subscriptions = this.config.subscriptions
        subscriptions.forEach(subscription => {
            this.utils.getArmClient(subscription.id).then(client => {
                this.refactorAllResourceGroups(client, subscription.rgs);
                this.refactorAllResources(client);
            })
        });
    }

    refactorAllResources(client: ResourceManagementClient) {
        client.resources.list().then(resources => {
            resources.forEach(resource => {
                this.refactorResourceTags(client, resource);
            })
        })
    }

    refactorAllResourceGroups(client: ResourceManagementClient, rgs: string[]) {
        if (rgs) {
            rgs.forEach(rgId => {
                client.resourceGroups.get(rgId).then(rg => {
                    this.refactorResourceGroupTags(client, rg.name, rg.tags);
                })
            })
        } else {
            client.resourceGroups.list().then(list => {
                list.forEach(rg => {
                    this.refactorResourceGroupTags(client, rg.name, rg.tags);
                })
            })
        }
    }

    refactorResourceTags(client: ResourceManagementClient, resource: GenericResourceExpanded) {
        if (resource.tags) {
            const newTags = this.refactorTags(resource.tags);
            var parameters = { tags: newTags };
            client.resources.updateById(resource.id, client.apiVersion, parameters).catch(err => {
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