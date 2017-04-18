var Messages = [
    {
        id: 1,
        text: "Hi, My Name is Bob, I am Bot.",
        sender: "bot"
    },
    {
        id: 2,
        text: "Now that you know me, can I get your name?",
        sender: "bot",
        key: "fullName",
        fieldType: "text"
    },
    {
        id: 3,
        text: "Thanks {fullName}, it is nice to meet you.",
        sender: "bot"
    },
    {
        id: 4,
        text: "Now that we are besties, what is your favorite color?",
        sender: "bot",
        key: "favoriteColor",
        fieldType: "radio",
        options: [
            {
                text: "Orange",
                value: "orange"
            },
            {
                text: "Blue",
                value: "blue"
            },
            {
                text: "Red",
                value: "red"
            },
            {
                text: "Other",
                value: "other"
            }
        ]
    },
];

export default Messages;