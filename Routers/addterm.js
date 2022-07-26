const express = require('express')
const Router = express.Router();
const client = require('../MongoInit.js').client;

Router.post('/' , async (req, res) => {

    const db = client.db("GlossaryEmergingTech");
    const termsToBeAdded = db.collection("TermsToBeAddedTest"); //Currently using a fake db for testing the functionality of this endpoint
    //Stores the request body
    const body = req.body;
    const termAlreadyExists = await termsToBeAdded.findOne({'TITLE': body.name});
    if (termAlreadyExists && termAlreadyExists['REQUESTER_EMAIL'].includes(body.email))
    {
        return res.status(201).send({message: "Chill out bro, your term is already requested"})
    }
    else if (termAlreadyExists) {
        await termsToBeAdded.updateOne({'TITLE': body.name}, {$set: {'REQUESTER_EMAIL' : termAlreadyExists['REQUESTER_EMAIL'] + ', ' + body.email}})
        return res.status(200).send({message: "Term is already requested, you will be notified when it is added"})
    }
    //Inserts a single term to the database, waits for it to finalize
    await termsToBeAdded.insertOne({
        'TITLE': body.name,
        'DESCRIPTION': body.description,
        'SOURCE': body.source,
        'ABBREVIATIONS' : body.abbreviations,
        'REQUESTER_EMAIL': body.email,
        'ADDED': 0
    });
    //Finally, send a response back to the requester tha the term has been successfully added to the list of terms to be added.
    res.status(200).send({message: "Your term has been successfully requested!"});
});



module.exports = Router;
