let data = {
    "Pet waste was left in my yard": ["poop", "poops", "pooping", "dump", "dog", "waste"],
    "Dangerous Dog": ["dog", "dangerous"],
    "Dangerous Cat": ["dangerous", "cat"],
    "Neighbor's Trash in my Yard": ["trash", "waste", "neighbor"]
};

class KeywordService {
    Get(text) {
        return this.find(text);
    };

    PredictAnswer(possibleAnswers) {
        if (possibleAnswers.length === 0)
            return [];
        if (possibleAnswers.length === 1)
            return possibleAnswers;

        let maxNumberOfMatches = Math.max.apply(Math,possibleAnswers.map(function(o){return o.numberOfMatches;}));
        return possibleAnswers.filter(function(answer) {
            return answer.numberOfMatches === maxNumberOfMatches;
        });
    };

    find(text) {
        let possibleAnswers = [];
        
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let keywords = data[key];
                let numberOfMatches = 0;

                for (let index in keywords) {
                    let word = keywords[index];

                    if ((' ' + text.indexOf(word) + ' ') > -1) numberOfMatches++;
                }

                if (numberOfMatches > 0) {
                    possibleAnswers.push({
                        keyword: key,
                        numberOfMatches: numberOfMatches
                    });
                }
            }
        }
        return possibleAnswers;
    };
};

export default KeywordService;

