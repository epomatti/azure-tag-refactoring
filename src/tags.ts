import { ResourceManagementClient } from "@azure/arm-resources";
import { GenericResourceExpanded } from "@azure/arm-resources/esm/models";
import * as api from "./api"
import Config from "./config"

require('dotenv').config();

// Tag operations

export const refactorTags = (tags: any): any => {
  const tagConfig = new Config().readConfigJson();
  tagConfig.forEach(tag => {
    const value = tags[tag.deprecatedTag];
    tags[tag.newTag] = value;
    delete tags[tag.deprecatedTag];
  })
  return tags;
}

const refactorResourceGroupTags = (client: ResourceManagementClient, id: string, tags: any) => {
  const newTags = refactorTags(tags);
  var parameters = { tags: newTags };
  client.resourceGroups.update(id, parameters).catch(err => {
    // TODO implement proper error treatment
    console.error(err);
  })
}

const refactorResourceTags = (client: ResourceManagementClient, resource: GenericResourceExpanded) => {
  const newTags = refactorTags(resource.tags);
  var parameters = { tags: newTags };
  client.resources.updateById(resource.id, client.apiVersion, parameters).catch(err => {
    // TODO implement proper error treatment
    console.error(err);
  })
}

// Resources

const refactorAllResourceGroups = (client: ResourceManagementClient, rgs: string[]) => {
  if (rgs) {
    rgs.forEach(rgId => {
      client.resourceGroups.get(rgId).then(rg => {
        refactorResourceGroupTags(client, rg.id, rg.tags);
      })
    })
  } else {
    client.resourceGroups.list().then(list => {
      list.forEach(rg => {
        refactorResourceGroupTags(client, rg.id, rg.tags);
      })
    })
  }
}

const refactorAllResources = (client: ResourceManagementClient) => {
  client.resources.list().then(resources => {
    resources.forEach(resource => {
      refactorResourceTags(client, resource);
    })
  })
}

export const replaceAllTags = () => {
  const subscriptions = new Config().readSubscriptionsJson();
  subscriptions.forEach(subscription => {
    api.getClient(subscription.id).then(client => {
      refactorAllResourceGroups(client, subscription.rgs);
      refactorAllResources(client);
    })
  });
}