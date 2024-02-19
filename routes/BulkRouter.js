const express = require('express');
const { comp_lt, upload_data } = require('../module/BulkModule');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
dateFormat = require("dateformat");
const csv = require('fast-csv');
const fileUpload = require("express-fileupload");
const { db_Insert } = require('../module/MasterModule');
const BulkRouter = express.Router();

// Sample data (replace this with your own data source)
// const data = [
//     { hsn_code: '', item_name: '', description: 'NA', unit_id: '0', container_id: '0', price: '', discount: '', cgst: '', sgst: '', created_by: '', created_dt: '' },
// ];

// const csvWriter = createCsvWriter({
//     path: 'output.csv',
//     header: [
//         { id: 'hsn_code', title: 'HSN CODE' },
//         { id: 'item_name', title: 'Item Name' },
//         { id: 'description', title: 'Description' },
//         { id: 'unit_id', title: 'Unit Id' },
//         { id: 'container_id', title: 'Container Id' },
//         { id: 'price', title: 'Price' },
//         { id: 'discount', title: 'Discount' },
//         { id: 'cgst', title: 'Cgst' },
//         { id: 'sgst', title: 'Sgst' },
//         { id: 'created_by', title: 'Created By' },
//         { id: 'created_dt', title: 'Created Dt' },
//     ]
// });

// // Write CSV data to file
// csvWriter.writeRecords(data)
//     .then(() => console.log('CSV file successfully created'))
//     .catch(err => console.error('Error writing CSV file:', err));

BulkRouter.use(fileUpload())

BulkRouter.get("/bulk_upload",async(req, res) => {
    var comp_list = await comp_lt();
    var res_dt = {
        data: comp_list.suc > 0 ? comp_list.msg : [],
    }
 res.render("bulk/bulk_upload",res_dt)
});

BulkRouter.post("/csv_upload", async (req, res) => {
    var data = req.body;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var csv_file = req.files.import_csv
    if (csv_file) {
        var csv_file_name = csv_file.name
        csv_file.mv('assets/uploads/' + csv_file_name, async (err) => {
            if (err) {
                // console.log(`${csv_file_name} not uploaded ${err}`);
            } else {
                // console.log(`Successfully ${csv_file_name} uploaded`);
                var csv_data = await uploadCsv('assets/uploads/' + csv_file_name)
                for (let dt of csv_data) {
                //   console.log(dt[9]);
                  var table_name = "md_items",
                  fields = `(com_id,hsn_code,item_name,description,unit_id,container_id,created_by,created_dt)`,
                  values = `('${data.comp_id}', '${dt[0]}','${dt[1]}','NA','0','0','${dt[9]}','${datetime}')`;
                  whr = null,
                  flag = 0;
                  var up_data = await db_Insert(table_name,fields,values,whr,flag) ;
                    if(up_data.suc > 0){
                        var table_name1 = "md_item_rate",
                        fields1 = `(item_id, price,discount,cgst,sgst)`,
                        values1 = `(${up_data.lastId.insertId}, '${dt[5]}','${dt[6]}','${dt[7]}','${dt[8]}')`;
                        whr1 = null,
                        flag1 = 0;
                        var up_data1 = await db_Insert(table_name1,fields1,values1,whr1,flag1) ;
                    }
                }
                // console.log(csv_data.length);
                // res.send(up_data1)
                req.session.message = {
                    type: "successful",
                    message: "CSV File uploaded successfully",
                  };
                res.redirect("/bulk/bulk_upload")
              
                // await SectionImageSave(data, filename);
                
                
            }
        })
    }
  });

  function uploadCsv(uriFile) {
    let stream = fs.createReadStream(uriFile);
    let csvDataColl = [];
    const addData = (data) => csvDataColl.push(data);
    return new Promise(async (resolve, reject) => {
        let fileStream = csv
            .parse()
            .on("data", function (data) {
                addData(data);
            })
            .on("end", function () {
                csvDataColl.shift();
                // console.log(csvDataColl);
                fs.unlinkSync(uriFile)
                resolve(csvDataColl)
            })
            stream.pipe(fileStream);
            // console.log('Closed');
        })
}


BulkRouter.post('/download_csv', async (req, res) => {
    var data = req.body
    var fileBuffer = fs.readFileSync('output.csv')
    // Send the PDF as a download
    res.setHeader('Content-Type', 'application/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sample.csv');
    res.send(fileBuffer);
})


module.exports = {BulkRouter};