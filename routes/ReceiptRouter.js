const { db_Select } = require('../module/MasterModule');

const ReceiptRouter = require('express').Router(),
    fs = require('fs'),
    puppeteer = require("puppeteer"),
    dateFormat = require('dateformat');

ReceiptRouter.get('/receipt', async (req, res) => {
    try {
        var receipt_no = req.query.receipt_no
        var select = 'receipt_no, comp_id, br_id, trn_date, price, discount_amt, cgst_amt, sgst_amt, amount, round_off, net_amt, pay_mode, received_amt, pay_dtls, cust_name, phone_no, gst_flag, gst_type, discount_flag, discount_type',
        table_name = 'td_receipt',
        whr = `receipt_no = ${receipt_no}`,
        order = null;
        var receipt_dtls = await db_Select(select, table_name, whr, order)

        var comp_dtls = await db_Select('id, company_name, address, location, contact_person, phone_no, email_id, logo', 'md_company', `id = ${receipt_dtls.suc > 0 ? (receipt_dtls.msg.length > 0 ? receipt_dtls.msg[0].comp_id : 0) : 0}`, null)

        var header_footer_dt = await db_Select('header1, on_off_flag1, header2, on_off_flag2, footer1, on_off_flag3, footer2, on_off_flag4', 'md_header_footer', `comp_id=${receipt_dtls.suc > 0 ? (receipt_dtls.msg.length > 0 ? receipt_dtls.msg[0].comp_id : 0) : 0}`, null)

        var select = 'a.receipt_no, a.comp_id, a.br_id, a.item_id, b.hsn_code, b.item_name, a.trn_date, a.price, a.dis_pertg, a.discount_amt, a.cgst_prtg, a.cgst_amt, a.sgst_prtg, a.sgst_amt, a.qty',
        table_name = 'td_item_sale a, md_items b',
        whr = `a.item_id=b.id AND a.comp_id=b.comp_id AND a.receipt_no = ${receipt_no}`,
        order = null;
        var item_dtls = await db_Select(select, table_name, whr, order)

        var select = 'SUM(cgst_amt) tot_cgst_amt, cgst_prtg, SUM(sgst_amt) tot_sgst_amt, sgst_prtg',
        table_name = 'td_item_sale',
        whr = `receipt_no = ${receipt_no}`,
        order = `GROUP BY cgst_prtg, sgst_prtg`;
        var gst_dtls = await db_Select(select, table_name, whr, order)

        var data = {
            receipt_dtls: receipt_dtls.suc > 0 ? receipt_dtls.msg : [],
            header_footer_dtls: header_footer_dt.suc > 0 ? header_footer_dt.msg : [],
            item_dtls: item_dtls.suc > 0 ? item_dtls.msg : [],
            gst_dtls: gst_dtls.suc > 0 ? gst_dtls.msg : [],
            comp_dtls: comp_dtls.suc > 0 ? comp_dtls.msg : []
        }

        // Generate PDF
        const pdfBuffer = await generatePDF(data);

        // Set response headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${receipt_no}.pdf`);

        // Send the PDF as response
        res.send(pdfBuffer);
        // res.send({receipt_dtls, header_footer_dt, item_dtls, gst_dtls})
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    }
})

// Function to generate PDF
async function generatePDF(data) {
    console.log(data);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // HTML content to be converted to PDF
    var header = `<!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!-- Tell the browser to be responsive to screen width -->
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Syn-Billing</title>
      </head>
    
      <body>
        <div class="page-wrapper">
          <style>
            table {
              border: none;
              padding: 10px;
            }
    
            table .texAlignLeft {
              text-align: left;
            }
    
            table .texAlignRight {
              text-align: right;
            }
  
            table tr.texAlignCenter td{
              text-align: center;
            }
    
            .tot_section {
              display: flex;
              justify-content: space-around;
              flex-direction: row;
            }
          </style>
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <table width="100%">
                      <tr>
                          <th colspan="8">${data.comp_dtls.length > 0 ? data.comp_dtls[0].company_name : ''}</th>
                      </tr>`
    var head1 = '', head2 = '', middle = '';
    if(data.comp_dtls[0].on_off_flag1 != 'N'){
        head1 = `<tr>
            <th colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].header1 : ''}</th>
        </tr>`
    }
    if(data.comp_dtls[0].on_off_flag2 != 'N'){
        head2 = `<tr>
            <th colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].header2 : ''}</th>
        </tr>`
    }
    middle = `<tr>
    <th colspan="8">DUPLICATE RECEIPT</th>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <td colspan="4">Store:</td>
    <td colspan="4">Customer Details:</td>
</tr>
<tr>
    <td colspan="4">${data.comp_dtls.length > 0 ? data.comp_dtls[0].address : ''}</td>
    <td colspan="4">${data.receipt_dtls.length > 0 ? data.receipt_dtls[0].cust_name : ''}</td>
</tr>
<tr>
    <td colspan="4">
        Contact Number: ${data.comp_dtls.length > 0 ? data.comp_dtls[0].phone_no : ''} 
        <br>
        Customer Care Email: ${data.comp_dtls.length > 0 ? data.comp_dtls[0].email_id : ''}
    </td>
    <td colspan="4">
        Phone: ${data.receipt_dtls.length > 0 ? data.receipt_dtls[0].phone_no : ''}
    </td>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <th colspan="8">Item Details</th>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <th>Item Name</th>
    <th>MRP</th>
    <th>Qty</th>
    <th>Price</th>
    <th>Discount</th>
    <th>CGST (%)</th>
    <th>SGST (%)</th>
    <th>Net Amount</th>
</tr>`
var tot_qty = 0, tot_item = 0, tot_amt = 0;
                      for(let dt of data.item_dtls){
                        var net_amt = (dt.price * dt.qty) - dt.discount_amt
                        tot_qty += dt.qty
                        tot_amt += net_amt
                        middle = middle + `<tr class="texAlignCenter">
                              <td>${dt.item_name}</td>
                              <td>${dt.price}</td>
                              <td>${dt.qty}</td>
                              <td>${dt.price * dt.qty}</td>
                              <td>${dt.discount_amt}</td>
                              <td>${dt.cgst_prtg}</td>
                              <td>${dt.sgst_prtg}</td>
                              <td>${net_amt}</td>
                          </tr>`
                          tot_item++;
                        }
        middle = middle +`<tr>
        <td colspan="8">
            <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
        </td>
    </tr>
    <tr>
        <td colspan="2">Total</td>
        <td colspan="2">Item: ${tot_item}</td>
        <td colspan="2">QTY: ${tot_qty}</td>
        <td colspan="2">AMT: ${tot_amt}</td>
    </tr>
    <tr>
        <td colspan="8">
            <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
        </td>
    </tr>
    <tr>
        <th colspan="8">GST Breakup</th>
    </tr>
    <tr>
        <td colspan="8">
            <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
        </td>
    </tr>`
    var tot_gst = 0
                      for(let dt of data.gst_dtls){
                        tot_gst += parseFloat(dt.tot_cgst_amt) + parseFloat(dt.tot_sgst_amt)
                        middle = middle + `<tr>
                              <td colspan="1">CGST</td>
                              <td class="texAlignLeft" colspan="1">@${dt.cgst_prtg}%</td>
                              <td class="texAlignLeft" colspan="1">:</td>
                              <td class="texAlignLeft" colspan="5">${dt.tot_cgst_amt}</td>
                          </tr>
                          <tr>
                            <td colspan="1">SGST</td>
                            <td class="texAlignLeft" colspan="1">@${dt.sgst_prtg}%</td>
                            <td class="texAlignLeft" colspan="1">:</td>
                            <td class="texAlignLeft" colspan="5">${dt.tot_sgst_amt}</td>
                        </tr>`
                      }
    middle = middle + `<tr>
    <th colspan="1">Total GST</th>
    <td></td>
    <td class="texAlignLeft" colspan="1">:</td>
    <td class="texAlignLeft" colspan="5">${tot_gst}</td>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <th colspan="8">Discount Breakup</th>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <td colspan="1">Discount</td>
    <td class="texAlignLeft" colspan="1">:</td>
    <td class="texAlignLeft" colspan="6">${data.receipt_dtls[0].discount_amt}</td>
</tr>
<tr>
    <td colspan="1">Total</td>
    <td class="texAlignLeft" colspan="1">:</td>
    <td class="texAlignLeft" colspan="6">${data.receipt_dtls[0].amount}</td>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <th colspan="8">Payment Summary</th>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>
<tr>
    <td colspan="1">Round Off:</td>
    <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].round_off}</td>
    <td colspan="1">Net Amount:</td>
    <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].net_amt}</td>
</tr>
<tr>
    <td colspan="1">Receipt No:</td>
    <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].receipt_no}</td>
    <td colspan="1">Date:</td>
    <td class="texAlignLeft" colspan="3">${dateFormat(data.receipt_dtls[0].trn_date, 'dd/mm/yyyy')}</td>
</tr>
<tr>
    <td colspan="1">Cash Received:</td>
    <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].received_amt}</td>
    <td colspan="1">Returned Amount:</td>
    <td class="texAlignLeft" colspan="3">${(data.receipt_dtls[0].received_amt - data.receipt_dtls[0].net_amt)}</td>
</tr>
<tr>
    <td colspan="8">
        <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
    </td>
</tr>`
var footer1 = ''
if(data.header_footer_dtls[0].on_off_flag3){
    footer1 = `<tr class="texAlignCenter">
        <td colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].footer1 : ''}</td>
    </tr>`
}
var footer2 = ''
if(data.header_footer_dtls[0].on_off_flag4){
    footer2 = `<tr class="texAlignCenter">
        <td colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].footer2 : ''}</td>
    </tr>`
}
var end = `</table>
</div>
</div>
</div>
</div>
</div>
</div>
</body>
</html>`

console.log(head1, head2);
var content = `${header}${head1}${head2}${middle}${footer1}${footer2}${end}`
    // console.log(content);

    // Set the content of the page
    await page.setContent(content);

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return pdfBuffer;
}

// const htmlContent = `<!DOCTYPE html>
//     <html dir="ltr" lang="en">
//       <head>
//         <meta charset="utf-8" />
//         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
//         <!-- Tell the browser to be responsive to screen width -->
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="description" content="" />
//         <meta name="author" content="" />
//         <title>Syn-Billing</title>
//       </head>
    
//       <body>
//         <div class="page-wrapper">
//           <style>
//             table {
//               border: none;
//               padding: 10px;
//             }
    
//             table .texAlignLeft {
//               text-align: left;
//             }
    
//             table .texAlignRight {
//               text-align: right;
//             }
  
//             table tr.texAlignCenter td{
//               text-align: center;
//             }
    
//             .tot_section {
//               display: flex;
//               justify-content: space-around;
//               flex-direction: row;
//             }
//           </style>
//           <div class="container-fluid">
//             <div class="row">
//               <div class="col-12">
//                 <div class="card">
//                   <div class="card-body">
//                     <table width="100%">
//                       <tr>
//                           <th colspan="8">${data.comp_dtls.length > 0 ? data.comp_dtls[0].company_name : ''}</th>
//                       </tr>`
//                       if(data.comp_dtls[0].on_off_flag1 != 'N'){
//                         `<tr>
//                             <th colspan="8">${data.item_dtls.length > 0 ? data.item_dtls[0].header1 : ''}</th>
//                         </tr>`
//                       }
//                       if(data.comp_dtls[0].on_off_flag2 != 'N'){
//                         `<tr>
//                             <th colspan="8">${data.item_dtls.length > 0 ? data.item_dtls[0].header2 : ''}</th>
//                         </tr>`
//                       }
//                       `<tr>
//                           <th colspan="8">DUPLICATE RECEIPT</th>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td colspan="4">Store:</td>
//                           <td colspan="4">Customer Details:</td>
//                       </tr>
//                       <tr>
//                           <td colspan="4">${data.comp_dtls.length > 0 ? data.comp_dtls[0].address : ''}</td>
//                           <td colspan="4">${data.receipt_dtls.length > 0 ? data.receipt_dtls[0].cust_name : ''}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="4">
//                               Contact Number: ${data.comp_dtls.length > 0 ? data.comp_dtls[0].phone_no : ''} 
//                               <br>
//                               Customer Care Email: ${data.comp_dtls.length > 0 ? data.comp_dtls[0].email_id : ''}
//                           </td>
//                           <td colspan="4">
//                               Phone: ${data.receipt_dtls.length > 0 ? data.receipt_dtls[0].phone_no : ''}
//                           </td>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <th colspan="8">Item Details</th>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <th>Item Name</th>
//                           <th>MRP</th>
//                           <th>Qty</th>
//                           <th>Price</th>
//                           <th>Discount</th>
//                           <th>CGST (%)</th>
//                           <th>SGST (%)</th>
//                           <th>Net Amount</th>
//                       </tr>`
//                       var tot_qty = 0, tot_item = 0, tot_amt = 0;
//                       for(let dt of data.item_dtls){
//                         var net_amt = (dt.price * dt.qty) - dt.discount_amt
//                         tot_qty += dt.qty
//                         tot_amt += net_amt
//                           + `<tr class="texAlignCenter">
//                               <td>${dt.item_name}</td>
//                               <td>${dt.price}</td>
//                               <td>${dt.qty}</td>
//                               <td>${dt.price * dt.qty}</td>
//                               <td>${dt.discount_amt}</td>
//                               <td>${dt.cgst_prtg}</td>
//                               <td>${dt.sgst_prtg}</td>
//                               <td>${net_amt}</td>
//                           </tr>`
//                           tot_item++;
//                         }
//                       +`<tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td colspan="2">Total</td>
//                           <td colspan="2">Item: ${tot_item}</td>
//                           <td colspan="2">QTY: ${tot_qty}</td>
//                           <td colspan="2">AMT: ${tot_amt}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <th colspan="8">GST Breakup</th>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>`
//                       var tot_gst = 0
//                       for(let dt of data.gst_dtls){
//                         tot_gst += parseFloat(dt.tot_cgst_amt) + parseFloat(dt.tot_sgst_amt)
//                           + `<tr>
//                               <td colspan="1">CGST</td>
//                               <td class="texAlignLeft" colspan="1">@${dt.cgst_prtg}%</td>
//                               <td class="texAlignLeft" colspan="1">:</td>
//                               <td class="texAlignLeft" colspan="5">${dt.tot_cgst_amt}</td>
//                           </tr>
//                           <tr>
//                             <td colspan="1">SGST</td>
//                             <td class="texAlignLeft" colspan="1">@${dt.sgst_prtg}%</td>
//                             <td class="texAlignLeft" colspan="1">:</td>
//                             <td class="texAlignLeft" colspan="5">${dt.tot_sgst_amt}</td>
//                         </tr>`
//                       }
//                       + `<tr>
//                           <th colspan="1">Total GST</th>
//                           <td></td>
//                           <td class="texAlignLeft" colspan="1">:</td>
//                           <td class="texAlignLeft" colspan="5">${tot_gst}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <th colspan="8">Discount Breakup</th>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td colspan="1">Discount</td>
//                           <td class="texAlignLeft" colspan="1">:</td>
//                           <td class="texAlignLeft" colspan="6">${data.receipt_dtls[0].discount_amt}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="1">Total</td>
//                           <td class="texAlignLeft" colspan="1">:</td>
//                           <td class="texAlignLeft" colspan="6">${data.receipt_dtls[0].amount}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <th colspan="8">Payment Summary</th>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>
//                       <tr>
//                           <td colspan="1">Round Off:</td>
//                           <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].round_off}</td>
//                           <td colspan="1">Net Amount:</td>
//                           <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].net_amt}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="1">Receipt No:</td>
//                           <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].receipt_no}</td>
//                           <td colspan="1">Date:</td>
//                           <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].trn_date}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="1">Cash Received:</td>
//                           <td class="texAlignLeft" colspan="3">${data.receipt_dtls[0].received_amt}</td>
//                           <td colspan="1">Returned Amount:</td>
//                           <td class="texAlignLeft" colspan="3">${(data.receipt_dtls[0].received_amt - data.receipt_dtls[0].net_amt)}</td>
//                       </tr>
//                       <tr>
//                           <td colspan="8">
//                               <p class="text-color" style=" border-style: dashed; border-width: 1px; width: 100%;"></p>
//                           </td>
//                       </tr>`
//                       if(data.header_footer_dtls[0].on_off_flag3){
//                           + `<tr class="texAlignCenter">
//                               <td colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].footer1 : ''}</td>
//                           </tr>`
//                       }
//                       if(data.header_footer_dtls[0].on_off_flag4){
//                           + `<tr class="texAlignCenter">
//                               <td colspan="8">${data.header_footer_dtls.length > 0 ? data.header_footer_dtls[0].footer2 : ''}</td>
//                           </tr>`
//                       }
//                     + `</table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </body>
//     </html>`;

module.exports = { ReceiptRouter }