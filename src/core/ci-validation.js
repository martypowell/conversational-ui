class CiValidation {
    Rules = {
        "fullName": {
            test: function(name) {
                return /^[a-zA-Z ]+$/.test(name);
            },
            message: "Please specify your First and Last name separated by a space. Ex. \"Dan Fox\""
        },
        "address": {
            test: function(name) {
                return /^[a-zA-Z0-9\s,'-]*$/.test(name);
            },
            message: "Please specify your First and Last name separated by a space. Ex. \"400 Washington Ave Towson, MD 21204\""
        },
        "email": {
            test: function(name) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(name);
            },
            message: "Please specify a valid email address. Ex. \"bot@baltimorecountymd.gov\""
		},
		"zipCode": {
            test: function(name) {
                return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(name);
            },
            message: "Please specify a valid zipcode. Ex. \"21204\""
        }
    }
};

export default CiValidation;