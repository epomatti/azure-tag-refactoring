import * as service from '../src/tags';

require('dotenv').config();

let main = () => {
    service.replaceAllTags();
}

main();