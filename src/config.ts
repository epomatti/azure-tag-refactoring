const fs = require('fs');

class Config {

    readConfigJson(): { deprecatedTag: string, newTag: string }[] {
        return this.parseJsonFile('config/tags.json');
    }
    readSubscriptionsJson(): { id: string, rgs: string[] }[] {
        return this.parseJsonFile('config/subscriptions.json');
    }
    parseJsonFile(path: string) {
        let rawdata = fs.readFileSync(path);
        return JSON.parse(rawdata);
    }
}

export default Config;