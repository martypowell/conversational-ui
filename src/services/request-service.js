const MockData = [
    {
        id: 1,
        trackingNumber: 1234356,
        followUpUrl: "//baltimorecountymd.gov/services/lookup/123456",
        type: 1,
        address: "400 Washington Ave Towson, MD 21204",
        status: 1
    }
];

class RequestService {
    constructor() {
        this.data = MockData;
    }
    Get = (params) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { 
                let id = params["id"] || null;
                let address = params["address"] || null;

                resolve(this.data.filter(function(item, index) {
                    let matchesId = id && item.id === id;
                    let matchesAddresss = id && item.address === address;

                    return matchesId && matchesAddresss && item.status;
                }));  
            }, 1000);
        })
    };
};

export default RequestService;