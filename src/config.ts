
const fs = require('fs');

export const readConfigJson = (): { deprecatedTag: string, newTag: string }[] => {
    return parseJsonFile('config/tags.json');
}

export const readSubscriptionsJson = (): { id: string, rgs: string[] }[] => {
    return parseJsonFile('config/subscriptions.json');
}

const parseJsonFile = (path: string) => {
    let rawdata = fs.readFileSync(path);
    return JSON.parse(rawdata);
}