import Program from "../src/program";

jest.mock('../src/utils', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                getConfig: () => {
                    return {
                        general: {
                            deleteTagsOnReplace: false,
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
        budget: 10000
    }

    const actual = new Program().refactorTags(tags)

    expect(actual.team).toBe("sales");
    expect(actual.squad).toBe("sales");
    expect(actual.environemnt).toBe("QA");
    expect(actual.budget).toBe(10000);
    expect(actual.estimate).toBe(10000);

});