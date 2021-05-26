import Program from "../src/program";

jest.mock('../src/utils', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                getConfig: () => {
                    return {
                        general: {
                            deleteTagsOnReplace: true,
                            overrideExistingTag: true

                        },
                        tagSwitches: [
                            {
                                tag: "team",
                                newTag: "squad"
                            },
                            {
                                tag: "budget",
                                newTag: "estimate"
                            }
                        ]
                    }
                }
            }
        })
    }
});

test('', () => {

    const tags = {
        team: "sales",
        environemnt: "QA",
        budget: 10000,
        estimate: 0
    }

    const actual = new Program().refactorTags(tags)

    expect(actual.team).toBeUndefined();
    expect(actual.squad).toBe("sales");
    expect(actual.environemnt).toBe("QA");
    expect(actual.budget).toBeUndefined();
    expect(actual.estimate).toBe(10000);

});