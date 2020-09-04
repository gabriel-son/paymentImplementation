const paystack = (request) => {
    const MySecretKey = `Bearer ${process.env.TEST_SECRET_KEY}`;
    // TEST_SECRET_KEY to be replaced by your own secret key
    const initializePayment = async (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers: {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            form
        }

        const callback = (error, response, body) => {
            mycallback(error, body);
            console.log(body);
            return body.authorization_url;

        }
          return request.post(options, callback)
    }
    const verifyPayment = async (ref, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
           }
        }
        const callback = (error, response, body)=>{
            return mycallback(error, body);
        }
        return await request(options,callback);
    }
    return {
        initializePayment,
        verifyPayment
    };
}

module.exports = paystack;