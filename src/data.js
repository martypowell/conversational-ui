var Messages = [
    {
        id: 1,
        text: "Hi, My Name is Bob, I am Bot.",
        sender: "bot"
    },
    {
        id: 2,
        text: "Now that you know me, can I get your full name?",
        sender: "bot",
        key: "fullName",
        fieldType: "text"
    },
    {
        id: 3,
        text: "Thanks ${fullName}, it is nice to meet you.",
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
                value: "orange",
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
    {
        id: 5,
        text: {
            "other": {
                message: "That's sad there are no other colors I know.",
                nextStep: 8
            },
            "default": {
                message: "OMGGGGGGGGGGGGGGGGGGGG I love ${favoriteColor}. OMG OMG",
                nextStep: 6
             }
        },
        key: 'favoriteColor',
        sender: "bot"
    },
    {
        id: 6,
        text: "Sorry I get really excited. Which type of ${favoriteColor} do you prefer?",
        sender: "bot",
        key: "favoriteShade",
        fieldType: "radio",
        options: [
            {
                text: "Light",
                value: "light",
            },
            {
                text: "Regular",
                value: "regular"
            },
            {
                text: "Dark",
                value: "dark"
            }
        ]
    },
    {
        id: 7,
        text: "Well it was nice getting to know you, here is what I found out. Your name is ${fullName} and really like ${favoriteShade} ${favoriteColor}. Have a great day.",
        sender: "bot",
        isLastMessage: true
    },
    {
        id: 8,
        text: "Well it was nice getting to know you, here is what I found out. Your name is ${fullName} and you don't really like colors. Have a great day.",
        sender: "bot",
        isLastMessage: true
    }
    
];

export default Messages;