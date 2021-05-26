import * as program from "../src/tags";

jest.mock('../src/config', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                readConfigJson: () => {
                    return [
                        {
                            "deprecatedTag": "team",
                            "newTag": "squad"
                        },
                        {
                            "deprecatedTag": "budget",
                            "newTag": "estimate"
                        }
                    ];
                }
            }
        })
    }
});

test('replaces tags', () => {

    const tags = {
        team: "sales",
        environemnt: "QA",
        budget: 10000
    }

    const actual = program.refactorTags(tags)

    expect(actual.team).toBeUndefined();
    expect(actual.environemnt).toBe("QA");
    expect(actual.budget).toBeUndefined();
    expect(actual.estimate).toBe(10000);


});