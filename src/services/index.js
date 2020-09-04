const _ = require('lodash');
const request = require('request');
const Donor = require('./../model/donor')
const {initializePayment, verifyPayment} = require('./../config/paystack')(request);
const CustomeError = require('./../utils/CustomeError');

class Payment {
    static async card_payment(data,res) {
        const form = _.pick(data, ['amount', 'email', 'full_name']);

        form.metadata = {
            full_name : form.full_name
        };

        form.amount *= 100;

        await initializePayment(form, (error, body) => {
            if(error) {
                throw new CustomeError("Am error occured", error)
            };

            const response = JSON.parse(body);
            //res.send(response.data.authorization_url)
            //return response.data.authorization_url
        })
    }

    static async confirm_transaction(data) {
        verifyPayment(data, async (error,body) => {
            if(error) {
                throw new CustomeError("Am error occured", error)
            };

            let response = JSON.parse(body);

            const result = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);

            [reference, amount, email, full_name] = result;

            newDonor = {reference, amount, email, full_name};

            const donor = new Donor(newDonor);

            response = await donor.save();

            if (response) {
                return null
            } else {
                throw new CustomeError('Am error occured')
            }
        })
    }
}

module.exports = Payment