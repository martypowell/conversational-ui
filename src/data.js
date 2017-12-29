var Messages = [
    {
        id: 1,
        text: "Hi, My Name is Bob, I am Bot.",
        sender: "bot"
    },
    {
        id: 2,
        text: "Are you a Baltimore County Resident?",
        sender: "bot",
        key: "isResident",
        fieldType: "radio",
        options: [
            {
                text: "Yes",
                value: 'true',
            },
            {
                text: "No",
                value: 'false'
            }
        ]
	},
	{
        id: 3,
        text: {
            "false": {
                message: "Sorry, you do not qualify for Spay/Neuter in Baltimore County",
                nextStep: 10
            },
            "default": {
                message: "OMGGGGGGGGGGGGGGGGGGGG Your are a resident, that's great",
                nextStep: 4
             }
        },
        key: 'isResident',
        sender: "bot"
    },
    {
        id: 4,
        text: "What type of pet do you have?",
		sender: "bot",
		key: "petType",
        fieldType: "radio",
        options: [
			{
                text: "Cat",
                value: 'cat',
            },
            {
                text: "Pit Bull",
                value: 'pitbull'
			},
			{
				text: "Another Type of Dog",
                value: 'dog-other'
			}
		]
	},
	{
        id: 5,
        text: {
			"dog-other": {
                message: "Oh I love dogs sooo much!!!",
                nextStep: 8
            },
            "default": {
                message: "You own a ${petType}, that's great",
                nextStep: 6
             }
        },
        key: 'petType',
        sender: "bot"
	},
	{
        id: 6,
        text: "Do you receive public assistance?",
		sender: "bot",
		key: "receivesPublicAssistance",
        fieldType: "radio",
        options: [
			{
                text: "Yes",
                value: 'true',
            },
            {
                text: "No",
                value: 'false'
            }
		]
	},
	{
        id: 7,
        text: {
			"false": {
                message: "You in fact do not receive public assistance",
                nextStep: 8
            },
            "default": {
                message: "You in fact receive public assistance.",
                nextStep: 11
             }
        },
        key: 'receivesPublicAssistance',
        sender: "bot"
	},
	{
		id: 8,
        text: "What is your zip code?",
        sender: "bot",
        key: "zipCode",
        fieldType: "text",
        validationTypes: ['zipCode']
	},
	{
        id: 9,
        text: (answers) => {
			const zip = answers.zipCode ? parseInt(answers.zipCode) : null;
			const dundalkCenterZips = [21222, 21219, 21220, 21221, 21224, 21237];
			const zipIsInDundalkZips = dundalkCenterZips.indexOf(zip) > -1;
			const nextStep = 10;

			if (zipIsInDundalkZips) {
				return {
					message: "Congrats you are qualified for a free procedure for your ${petType} at one of our Dundalk Centers. <a href='https://clinichq.com/online/144afb8f-6c15-4f15-8e16-9417a4f85823'>Register</a> now",
					nextStep: nextStep
				};
			}

			const swapCenterZips = [21227, 21228, 21244, 21207];
			const isCat = answers.petType ? answers.petType.toLowerCase().indexOf('cat') > -1 : false;
			const zipIsInSwapZips = swapCenterZips.indexOf(zip) > -1;
			if (isCat && zipIsInSwapZips) {
				return {
					message: "Congrats you are qualified for a free procedure for your ${petType} at one of our SWAP Centers.",
					nextStep: nextStep
				};
			}
					
			return {
				message: "Congrats you are qualified for a $20 procedure at any of our locations.",
				nextStep: nextStep
			};
		},
        key: 'zipCode',
        sender: "bot"
	},
    {
        id: 10,
        text: "Have a nice day :)",
		sender: "bot",
		isLastMessage: true
	},
	{
        id: 11,
        text: "Well, I have some great news, you qualify for a free procedure at any of our locations.",
		sender: "bot",
		isLastMessage: true
    }
];

export default Messages;