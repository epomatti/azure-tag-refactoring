# Azure Tag Renaming

A script/program for refactoring (renaming) thousands of tags of all the elements, resources and resource grups, in a list of subscriptions on Azure Cloud.

## What it does

You provide a list of subscriptions and a pair of tags and the program iterates over the subscriptions in the list, copying the values of old tags to new tags, and deleting the old tag in the process (optionally).

Example:

1. Resource A has tag "ProjectName=MyApp"
2. Configuration set in `config.json` renames tag "ProjectName" to "SystemName"
3. You execute the script
4. Resource A no has tag "SystemName=MyApp". Old tag "ProjectName" is deleted.

This will be done for all the resources and resource groups that are part of all of the subscriptions listed in the `config.json` file.

## How it works

Setup the `.env` file for connectivity with the list subscriptions. 

```sh
cp examples/example.env .env

# .env 
CLIENT_ID=
APPLICATION_SECRET=
TENANT_ID=
CONFIG_JSON_PATH=
```

You must have an App Registration on Azure with enough permissions to run on the subscriptions.

Configure your `config.json` with the relevant parameters:

- **general.deleteTagsOnReplace** - Delete the old tag after copying the value to the new tag.
- **general.overrideExistingTag** - Overrides an existing tag value if the tag already exists in the target resources.
- **tagSwitches** - The list of tags for renaming.
- **tagSwitches.tag** - Current tag that will be renamed.
- **tagSwitches.newTag** - New named for the tag.
- **subscriptions** - The list of subscriptions to be scanned by the script.

Get it from the `examples` folder:

```sh
cp examples/example.config.json config.json
```

Sample file:

```json
{
    "general": {
        "deleteTagsOnReplace": true,
        "overrideExistingTag": false
    },
    "tagSwitches": [
        {
            "tag": "<This tag will be replaced with a new tag>",
            "newTag": "<New tag with the old value>"
        }
    ],
    "subscriptions": [
        {
            "id": "<subscription_id>"
        }
    ]
}
```

You may also inform which resources groups names will be scanned by the script, although this was implemented primarily for testing.

```json
"subscriptions": [
    {
        "id": "<subscription_id>",
        "rgs": [
            "<resourcegroup_name1>",
            "<resourcegroup_name2>",
            "<resourcegroup_name3>"
        ]
    }
]
```

Install the software dependencies:

```sh
yarn install
```

Running the app:

```
yarn start
```

### Testing on Azure

Create temporary resources to test on Azure:

```sh
group='rg-testingtags-001'
location='eastus2'

az group create -n $group -l $location --tags tag1=value1 tag2=value2
az network vnet create -n 'vnet-testingtags-001' -g $group  -l $location --tags tag1=value1 tag2=value2

# clean your resources
az group delete -n 'rg-testingtags-001' --yes
```

## Sources

```
https://docs.microsoft.com/en-us/samples/azure-samples/resource-manager-node-resources-and-groups/resource-manager-node-resources-and-groups/
https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-cli
```
