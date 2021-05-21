# azure-tag-refactoring
Refactoring for tags of Azure resources.

npm install -g ts-node
npm install -g typescript

ts-node tags.ts

Give permissions to the app

1. create an app
2. add app to the subscriptions permissions IAM (tags only?)



1. Iterates over a subscription list
2. 


```
[
    {
        "deprecatedTag": "sys_admin",
        "newTag": "SRE"
    },
    {
        "deprecatedTag": "ProjectTeam",
        "newTag": "Squad"
    }
]


https://docs.microsoft.com/en-us/samples/azure-samples/resource-manager-node-resources-and-groups/resource-manager-node-resources-and-groups/