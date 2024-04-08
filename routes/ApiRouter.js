const { db_Select } = require('../module/MasterModule');

const ApiRouter = require('express').Router(),
request = require('request');

ApiRouter.post('/send_otp', async (req, res) => {
    try{
        var data = req.body
        var otp = Math.floor(1000 + Math.random() * 9000)
        var select = 'otp_template', table_name = 'md_sms', whr = `comp_id=${data.comp_id}`, order = null;
        var template_dt = await db_Select(select, table_name, whr, order);
    
        var default_text = `https://bulksms.sssplsales.in/api/api_http.php?username=SYNERGIC&password=SYN@526RGC&senderid=SYNGIC&to=${data.phone}&text=OTP for mobile verification is ${otp}. This code is valid for 5 minutes. Please do not share this OTP with anyone.-SYNGIC&route=Informative&type=text`
        var temp = template_dt.msg[0].otp_template
        var sms_url = template_dt.suc > 0 && template_dt.msg.length > 0 ? temp.replace('#{SENDER}#', data.phone.toString()).replace('#{OTP}#', otp.toString()) : default_text

        var options = {
            'method': 'GET',
            'url': sms_url,
            'headers': {
            }
        }
    
        request(options, function (error, response) {
            var res_dt = ''
            if (error) {
                res_dt = {suc: 0, msg: error, otp: 0}
            }else{
                res_dt = {suc: template_dt.suc > 0 ? 1 : 0, msg: response.body, otp: otp}
            }
            res.send(res_dt)
        });
    }catch(err){
        res.send({suc:0, msg: err, otp: 0})
    }
})

ApiRouter.post('/bill_sms', async (req, res) => {
    try{

        var data = req.body
        var select = 'bill_template', table_name = 'md_sms', whr = `comp_id=${data.comp_id}`, order = null;
        var template_dt = await db_Select(select, table_name, whr, order);
    
        var short_url = await ShortUrl(`https://admin.bill365.app/bill/receipt?receipt_no=${data.receipt_no}`)
        var srt_url = short_url.suc > 0 ? short_url.msg.shorturl : ''
    
        var default_text = `https://bulksms.sssplsales.in/api/api_http.php?username=SYNERGIC&password=SYN@526RGC&senderid=SYNGIC&to=${data.phone}&text=Dear customer, thank you for shopping with us. For eBill please click ${srt_url} -Synergic softek solutions pvt ltd.&route=Informative&type=text`
        var temp = template_dt.msg[0].bill_template
        var sms_url = template_dt.suc > 0 && template_dt.msg.length > 0 ? temp.replace('#{SENDER}#', data.phone.toString()).replace('#{URL}#', srt_url) : default_text
    
        var options = {
            'method': 'GET',
            'url': sms_url,
            'headers': {
            }
        }
    
        request(options, function (error, response) {
            var res_dt = ''
            if (error) {
                res_dt = {suc: 0, msg: error}
            }else{
                res_dt = {suc: template_dt.suc > 0 ? 1 : 0, msg: response.body}
            }
            res.send(res_dt)
        });
    }catch(err){
        res.send({suc:0, msg: err})
    }
})

const ShortUrl = (url) => {
    return new Promise((resolve, reject) => {
        var options = {
            'method': 'GET',
            'url': `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`,
            'headers': {
            }
        }
        request(options, function (error, response) {
            var res_dt = ''
            if (error) {
                res_dt = {suc: 0, msg: error}
            }else{
                res_dt = {suc: 1, msg: response.body}
            }
            resolve(res_dt)
        });
    })
}

module.exports = {ApiRouter}