const express = require('express');
const { comp_lt, upload_data } = require('../module/BulkModule');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const BulkRouter = express.Router();

// Sample data (replace this with your own data source)
// const data = [
//     { name: 'John', age: 30, email: 'john@example.com' },
//     { name: 'Jane', age: 25, email: 'jane@example.com' },
//     { name: 'Doe', age: 35, email: 'doe@example.com' }
// ];

// const csvWriter = createCsvWriter({
//     path: 'output.csv',
//     header: [
//         { id: 'name', title: 'Name' },
//         { id: 'age', title: 'Age' },
//         { id: 'email', title: 'Email' }
//     ]
// });

// Write CSV data to file
// csvWriter.writeRecords(data)
//     .then(() => console.log('CSV file successfully created'))
//     .catch(err => console.error('Error writing CSV file:', err));

BulkRouter.get("/bulk_upload",async(req, res) => {
    var data = req.query;
    // var upload_dtls = await upload_data(data.comp_id)
    var comp_list = await comp_lt();
    // console.log(upload_dtls);
    var res_dt = {
        data: comp_list.suc > 0 ? comp_list.msg : [],
    }
 res.render("bulk/bulk_upload",res_dt)
});


module.exports = {BulkRouter};