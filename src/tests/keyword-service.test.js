let KeywordService = require('../services/keyword-service').default;
let keywordService;

beforeEach(() => {
    keywordService = new KeywordService();
});

test('User has Exactly 1 keyword match', () => {
    let userInput = "There is a huge dump in the front of my house.";
    let keywordData = keywordService.Get(userInput);
    let expectedAnswer = [{
        keyword: "Pet waste was left in my yard",
        numberOfMatches: 1
    }];

    //Objects are the same
    expect(keywordData).toEqual(expectedAnswer);

    //Only One Possible Answers is Returned
    expect(keywordData.length).toBe(1);
});

test('User has multiple keyword matches', () => {
    let userInput = "There is a dangerous dog in my yard.";
    let keywordData = keywordService.Get(userInput);
    let expectedAnswer = [{
            keyword: "Pet waste was left in my yard",
            numberOfMatches: 1
        },
        {
            keyword: "Dangerous Dog",
            numberOfMatches: 2
        },
        {
            keyword: "Dangerous Cat",
            numberOfMatches: 1
        }
    ];

    //Objects are the same
    expect(keywordData).toEqual(expectedAnswer);

    //Only One Possible Answers is Returned
    expect(keywordData.length).toBe(3);
});

test('User has not matched a keyword search.', () => {
    let userInput = "There is a huge tree that won't stop talking in front of my house.";
    let keywordData = keywordService.Get(userInput);

    //Objects are the same
    expect(keywordData).toEqual([]);

    //Only One Possible Answers is Returned
    expect(keywordData.length).toBe(0);
});

/** Prediction */
test('User has 1 predicted answer.', () => {
    let userInput = "There is a dangerous dog in my yard.";
    let keywordData = keywordService.Get(userInput);
    var predictedType = keywordService.PredictAnswer(keywordData);

    expect(predictedType[0].keyword).toBe("Dangerous Dog");
    expect(predictedType.length).toBe(1);
});

test('User has multiple predicted answers.', () => {
    let userInput = "There is waste in my yard from next door";
    let keywordData = keywordService.Get(userInput);
    var predictedType = keywordService.PredictAnswer(keywordData);

    expect(predictedType.length).toBe(2);
});

test('User has no predicted answers.', () => {
    let userInput = "I really like unit testings, it's pretty cool";
    let keywordData = keywordService.Get(userInput);
    var predictedType = keywordService.PredictAnswer(keywordData);

    expect(predictedType).toEqual([]);
});