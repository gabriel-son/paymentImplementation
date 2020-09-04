const customeResponse = require('./../utils/response')
const _ = require('lodash');
const request = require('request');
const Donor = require('./../model/donor')
const {initializePayment, verifyPayment} = require('./../config/paystack')(request);
const CustomeError = require('./../utils/CustomeError');

class Payment {
   static async card_payment(req, res) {
       //the user email, full_name is needed, you can modify it to retrieve it from the db
       //but am sending it thrpugh the request body for testing purposes
       const data = req.body;
       //the booth represent an array of amount for the three ticket category
       //the FE is will be sending a property called "ticketNo" which will hold 
       //a numerical value in this scenario which will represent the ticket 
       //selected by the SME
       let booth = [10, 25, 50];
       const dollarConversionRate = 450
       data.amount = booth[data.ticketNo];
       //converting the amount from dollar to naira
       data.amount *= dollarConversionRate;
        const form = _.pick(data, ['amount', 'email', 'full_name']);
        //the name will be returned back by stack if stored in metadata
        form.metadata = {
            full_name : form.full_name
        };
        //paystack accepts its amout in kobo, hence the reason for the conversion below
        form.amount *= 100;

        await initializePayment(form, (error, body) => {
            if(error) {
                throw new CustomeError("Am error occured", error)
            };

            const result = JSON.parse(body);
            res.status(200).send(customeResponse('Payment initialize successfully', {authorization_url:result.data.authorization_url}))
        })
    }

    static async confirm_transaction(req, res) {
        const ref = req.query.reference;
        verifyPayment(ref, async (error,body) => {
            if(error) {
                throw new CustomeError("Am error occured", error)
            };

            let response = JSON.parse(body);

            let result = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);
           let [reference, amount, email, full_name] = result;

           amount /= 100;

            let newDonor = {reference, amount, email, full_name};

            const donor = new Donor(newDonor);

            response = await donor.save();

            if (response) {
                res.status(200).send(customeResponse('Payment Successful.'))
            } else {
                throw new CustomeError('Am error occured')
            }
        })
       
    }

}

module.exports = Payment;