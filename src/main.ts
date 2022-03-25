import Program from './program';

async function main() {
    await new Program().replaceAllTags();
}
main()