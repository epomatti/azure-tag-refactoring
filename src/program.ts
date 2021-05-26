import { ResourceManagementClient } from "@azure/arm-resources";
import { GenericResourceExpanded } from "@azure/arm-resources/esm/models";
import Utils from "./utils"

class Program {

    replaceAllTags() {
        const utils = new Utils();
        const subscriptions = utils.getConfig().subscriptions
        subscriptions.forEach(subscription => {
            utils.getArmClient(subscription.id).then(client => {
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
                    this.refactorResourceGroupTags(client, rg.id, rg.tags);
                })
            })
        } else {
            client.resourceGroups.list().then(list => {
                list.forEach(rg => {
                    this.refactorResourceGroupTags(client, rg.id, rg.tags);
                })
            })
        }
    }

    refactorResourceTags(client: ResourceManagementClient, resource: GenericResourceExpanded) {
        const newTags = this.refactorTags(resource.tags);
        var parameters = { tags: newTags };
        client.resources.updateById(resource.id, client.apiVersion, parameters).catch(err => {
            // TODO implement proper error treatment
            console.error(err);
        })
    }

    refactorResourceGroupTags(client: ResourceManagementClient, id: string, tags: any) {
        const newTags = this.refactorTags(tags);
        var parameters = { tags: newTags };
        client.resourceGroups.update(id, parameters).catch(err => {
            // TODO implement proper error treatment
            console.error(err);
        })
    }

    refactorTags(tags: any): any {
        const config = new Utils().getConfig();
        config.tagSwitches.forEach(tagSwitch => {
            if (!tags[tagSwitch.newTag] || config.general.overrideExistingTag) {
                const value = tags[tagSwitch.tag];
                tags[tagSwitch.newTag] = value;
            }
            if (config.general.deleteTagsOnReplace) {
                delete tags[tagSwitch.tag];
            }
        })
        return tags;
    }
}

export default Program;