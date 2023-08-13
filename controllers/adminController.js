import users from '../models/users.js'
import planpackage from '../models/plan.js'
import dailytask from '../models/dailytask.js'
import admin from '../models/admin.js'
import role from '../models/role.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import moment from 'moment';
import Cloudinary from 'cloudinary'
import discover from '../models/discover.js';
import category from '../models/category.js';
import level from '../models/level.js';
import nodemailer from 'nodemailer';
import task from '../models/task.js'
import facilitator from '../models/facilitator.js'

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtppro.zoho.com",
       auth: {
            user:'hello@jupitapp.co',
            pass:'xW1hyG7CDGhm'
            // pass:'ii84NsMqT9Xv'
         },
    secure: true,
    });

Cloudinary.config({
    cloud_name:'dgabmeacq',
    api_key:'557461256887664',
    api_secret:'ynduulzzjmpTXh5kGV_akLtOH2E'
})


function generateAccessToken(email,firstname) {
    const accessToken =  jwt.sign({username:email,firstname:firstname}, process.env.TOKEN_SECRET, { expiresIn: '216000s' });
    const refreshToken = jwt.sign(email, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});
    return { accessToken:accessToken,refreshToken:refreshToken}
}


// Cloudinary.v2.uploader.upload(uploadStr,{
//     overwrite:true,
//     invalidate:true
// },
// function (error,result){
//     if(error){
//             console.log('Error uploaded')
//     }
//     else{
//         console.log('uploaded')
//     }
// })

const indexpage = (req,res)=>{
    res.json({
        'Message':"Welcome Adminer",
        "status":true
    })
}

function generateRandomNumber(n) {
    return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
  }
const createAdmin = (req,res)=>{
    let fname = req.body?.fname
    let lname = req.body?.lname
    let password = req.body?.password
    let email = req.body?.email

  
    if(fname && lname && password && email){
        admin.findOne({email:email},async(err,docs)=>{
            if(err){
                res.status(401).send({'error':err})
            }
            else if(docs){
                res.status(401).send({
                    'message':'Email adready in use',
                    'status':false
                })
            }
            else if(!docs){
                const salt = await bcrypt.genSalt(10);
                let newpassword = await bcrypt.hash(password, salt);
                const adminCreated = await admin.create({
                    password:newpassword,
                    status:"active",
                    roleid:1,
                    email:email,
                    email_verified:false,
                    firstname:fname,
                    lastname:lname
                })

                // const mailData = {
                //     from: 'Jupit<hello@jupitapp.co>',  // sender address
                //     to: req.body.email,   // list of receivers
                //     subject: 'Onboarding@elitefitnessclub.ng<One Time Password>',
                //     text: 'That was easy!',
                //     html: `
                //     <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                //     <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                    
                //     <head>
                //       <!--[if gte mso 9]>
                //     <xml>
                //       <o:OfficeDocumentSettings>
                //         <o:AllowPNG/>
                //         <o:PixelsPerInch>96</o:PixelsPerInch>
                //       </o:OfficeDocumentSettings>
                //     </xml>
                //     <![endif]-->
                //       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
                //       <meta name="x-apple-disable-message-reformatting">
                //       <!--[if !mso]><!-->
                //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
                //       <!--<![endif]-->
                //       <title></title>
                    
                //       <style type="text/css">
                //         @media only screen and (min-width: 570px) {
                //           .u-row {
                //             width: 550px !important;
                //           }
                //           .u-row .u-col {
                //             vertical-align: top;
                //           }
                //           .u-row .u-col-100 {
                //             width: 550px !important;
                //           }
                //         }
                        
                //         @media (max-width: 570px) {
                //           .u-row-container {
                //             max-width: 100% !important;
                //             padding-left: 0px !important;
                //             padding-right: 0px !important;
                //           }
                //           .u-row .u-col {
                //             min-width: 320px !important;
                //             max-width: 100% !important;
                //             display: block !important;
                //           }
                //           .u-row {
                //             width: calc(100% - 40px) !important;
                //           }
                //           .u-col {
                //             width: 100% !important;
                //           }
                //           .u-col>div {
                //             margin: 0 auto;
                //           }
                //         }
                        
                //         body {
                //           margin: 0;
                //           padding: 0;
                //         }
                        
                //         table,
                //         tr,
                //         td {
                //           vertical-align: top;
                //           border-collapse: collapse;
                //         }
                        
                //         p {
                //           margin: 0;
                //         }
                        
                //         .ie-container table,
                //         .mso-container table {
                //           table-layout: fixed;
                //         }
                        
                //         * {
                //           line-height: inherit;
                //         }
                        
                //         a[x-apple-data-detectors='true'] {
                //           color: inherit !important;
                //           text-decoration: none !important;
                //         }
                        
                //         table,
                //         td {
                //           color: #000000;
                //         }
                        
                //         a {
                //           color: #0000ee;
                //           text-decoration: underline;
                //         }
                        
                //         @media (max-width: 480px) {
                //           #u_content_image_4 .v-src-width {
                //             width: auto !important;
                //           }
                //           #u_content_image_4 .v-src-max-width {
                //             max-width: 80% !important;
                //           }
                //         }
                //       </style>
                    
                    
                    
                //       <!--[if !mso]><!-->
                //       <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
                //       <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">
                //       <!--<![endif]-->
                    
                //     </head>
                    
                //     <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
                //       <!--[if IE]><div class="ie-container"><![endif]-->
                //       <!--[if mso]><div class="mso-container"><![endif]-->
                //       <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
                //         <tbody>
                //           <tr style="vertical-align: top">
                //             <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                //               <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                    
                    
                //               <div class="u-row-container" style="padding: 0px;background-color: transparent">
                //                 <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                //                   <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                //                     <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #ffffff;"><![endif]-->
                    
                //                     <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                //                     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                //                       <div style="width: 100% !important;">
                //                         <!--[if (!mso)&(!IE)]><!-->
                //                         <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                //                           <!--<![endif]-->
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <table width="100%" cellpadding="0" cellspacing="0" border="0">
                //                                     <tr>
                //                                       <td style="padding-right: 0px;padding-left: 0px;" align="center">
                    
                //                                         <img align="center" border="0" src="https://images.unlayer.com/projects/89020/1657367336441-895948.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 205px;"
                //                                           width="205" class="v-src-width v-src-max-width" />
                    
                //                                       </td>
                //                                     </tr>
                //                                   </table>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <!--[if (!mso)&(!IE)]><!-->
                //                         </div>
                //                         <!--<![endif]-->
                //                       </div>
                //                     </div>
                //                     <!--[if (mso)|(IE)]></td><![endif]-->
                //                     <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                //                   </div>
                //                 </div>
                //               </div>
                    
                    
                    
                //               <div class="u-row-container" style="padding: 0px;background-color: transparent">
                //                 <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                //                   <div style="border-collapse: collapse;display: table;width: 100%;background-image: url('https://cdn.templates.unlayer.com/assets/1636376675254-sdsdsd.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;">
                //                     <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-image: url('https://cdn.templates.unlayer.com/assets/1636376675254-sdsdsd.png');background-repeat: no-repeat;background-position: center top;background-color: transparent;"><![endif]-->
                    
                //                     <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                //                     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                //                       <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                //                         <!--[if (!mso)&(!IE)]><!-->
                //                         <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                //                           <!--<![endif]-->
                    
                //                           <table id="u_content_image_4" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 25px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <table width="100%" cellpadding="0" cellspacing="0" border="0">
                //                                     <tr>
                //                                       <td style="padding-right: 0px;padding-left: 0px;" align="center">
                    
                //                                         <img align="center" border="0" src="https://cdn.templates.unlayer.com/assets/1636374086763-hero.png" alt="Hero Image" title="Hero Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 54%;max-width: 286.2px;"
                //                                           width="286.2" class="v-src-width v-src-max-width" />
                    
                //                                       </td>
                //                                     </tr>
                //                                   </table>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                           <tbody>
                //                             <tr>
                //                               <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                  
                //                                 <div style="color: #a7a5a5; line-height: 140%; text-align: center; word-wrap: break-word;">
                //                                   <p style="font-size: 14px; line-height: 140%;"><strong><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 19.6px;">Dear SUPER ADMIN,</span></strong></p>
                //                                 </div>
                  
                //                               </td>
                //                             </tr>
                //                           </tbody>
                //                         </table>
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 20px 5px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <h2 style="margin: 0px; color: #141414; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: 'Open Sans',sans-serif; font-size: 28px;">
                //                                     <strong>Here Is Your One Time Password</strong>
                //                                   </h2>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                                        
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 12px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <h1 style="margin: 0px; color: #3b4d63; line-height: 140%; text-align: center; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 41px;">
                //                                     <strong><span style="text-decoration: underline;">${password}</span></strong>
                //                                   </h1>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 117px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <div style="color: #1c1c93; line-height: 140%; text-align: center; word-wrap: break-word;">
                //                                     <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px;"><strong><span style="font-family: Lato, sans-serif; line-height: 25.2px; font-size: 18px;">Valid For 15 minutes Only!</span></strong>
                //                                       </span>
                //                                     </p>
                //                                   </div>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <!--[if (!mso)&(!IE)]><!-->
                //                         </div>
                //                         <!--<![endif]-->
                //                       </div>
                //                     </div>
                //                     <!--[if (mso)|(IE)]></td><![endif]-->
                //                     <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                //                   </div>
                //                 </div>
                //               </div>
                    
                    
                    
                //               <div class="u-row-container" style="padding: 0px;background-color: transparent">
                //                 <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #000000;">
                //                   <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                //                     <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #000000;"><![endif]-->
                    
                //                     <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                //                     <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                //                       <div style="width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                //                         <!--[if (!mso)&(!IE)]><!-->
                //                         <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                //                           <!--<![endif]-->
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="83%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #443e3e;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                                     <tbody>
                //                                       <tr style="vertical-align: top">
                //                                         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                                           <span>&#160;</span>
                //                                         </td>
                //                                       </tr>
                //                                     </tbody>
                //                                   </table>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <div align="center">
                //                                     <div style="display: table; max-width:44px;">
                //                                       <!--[if (mso)|(IE)]><table width="44" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:44px;"><tr><![endif]-->
                    
                    
                //                                       <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                //                                       <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                //                                         <tbody>
                //                                           <tr style="vertical-align: top">
                //                                             <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                //                                               <a href="https://instagram.com/" title="Instagram" target="_blank">
                //                                                 <img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                //                                               </a>
                //                                             </td>
                //                                           </tr>
                //                                         </tbody>
                //                                       </table>
                //                                       <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    
                //                                       <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                //                                     </div>
                //                                   </div>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="83%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #443e3e;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                                     <tbody>
                //                                       <tr style="vertical-align: top">
                //                                         <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                //                                           <span>&#160;</span>
                //                                         </td>
                //                                       </tr>
                //                                     </tbody>
                //                                   </table>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                //                             <tbody>
                //                               <tr>
                //                                 <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                    
                //                                   <div style="color: #a3b2c3; line-height: 140%; text-align: center; word-wrap: break-word;">
                //                                     <p style="font-size: 14px; line-height: 140%;">Elite Fitness Club</p>
                //                                   </div>
                    
                //                                 </td>
                //                               </tr>
                //                             </tbody>
                //                           </table>
                    
                //                           <!--[if (!mso)&(!IE)]><!-->
                //                         </div>
                //                         <!--<![endif]-->
                //                       </div>
                //                     </div>
                //                     <!--[if (mso)|(IE)]></td><![endif]-->
                //                     <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                //                   </div>
                //                 </div>
                //               </div>
                    
                    
                //               <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                //             </td>
                //           </tr>
                //         </tbody>
                //       </table>
                //       <!--[if mso]></div><![endif]-->
                //       <!--[if IE]></div><![endif]-->
                //     </body>
                    
                //     </html>
                //         `
                //   };
                // transporter.sendMail(mailData, function (err, info) {
                //     if(err){
                //         console.log(err);
                //         // res.status(400).send(err)
                //         res.status(400).send({"message":"An Error Occurred","callback":err})
                //     }
                    
                //     else{
                        
                //         res.send({"message":"Admin Creation was Successful..OTP has been sent to the registered Email","callback":info,"status":true})
                        
                //     }
                      
                //  });
                res.send({
                    "message":'Admin Created',
                    "status":true,
                    "admin":adminCreated
                })
            }
        })
    }
    else{
        res.status(401).send({
            "message":"NO DATA"
        })
    }

    
}

const createRole = (req,res)=>{
    let rolename = req.body?.rolename
    
    if(rolename){
        role.findOne({rolename:rolename},async(err,docs)=>{
            if(err){
                res.status(401).send({'error':err})
            }
            else if(docs){
                res.status(401).send({
                    'message':'rolename not unique',
                    'status':false
                })
            }
            else if(!docs){
                
                const roleCreated = await role.create({
                    rolename:rolename,
                    
                })
                res.send({
                    "message":'Role Created',
                    "status":true,
                    "role":roleCreated
                })
            }
        })
    }
    else{
        res.status(401).send({
            "message":"NO DATA"
        })
    }

    
}

const createFacilitator = (req,res)=>{
    let firstname = req.body?.firstname
    let lastname = req.body?.lastname
    let address = req.body?.address
    let phonenumber = req.body?.phonenumber
    let email = req.body?.email
    
    if(firstname && lastname && address && phonenumber && email){
        facilitator.findOne({email:email},async(err,docs)=>{
            if(err){
                res.status(401).send({'error':err})
            }
            else if(docs){
                res.status(401).send({
                    'message':'Facilitator Email not unique',
                    'status':false
                })
            }
            else if(!docs){

                let createFacilitator = await facilitator.create({
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    phonenumber:phonenumber,
                    address:address

                })
                res.status(201).send({
                    "message":"Facilitator Created",
                    "status":true,
                    "data":createFacilitator
                })

                
               
            }
        })
    }
    else{
        res.status(401).send({
            "message":"NO DATA"
        })
    }

    
}

const allfacilitator =((req,res)=>{
    facilitator.find({},(err,docs)=>{
        if(err){
            res.status(401).send(err)
        }
        else if(docs){
            res.send({
                "message":"allcoaoch",
                "data":docs,
                "status":true
            })
        }
    })
})



const createCategory = (async (req,res)=>{
    let body = req.body

    console.log(body)
    let createcategory = await category.create({
        name:body.name,
        status:body.status
    })

    if(createcategory){
        res.send({
            'message':'Category Created',
            'data':createCategory,
            'status':true
        })
    }
    else{
        res.send({
            'message':'Category Error',
            'status':false
        })
    }
})

const createLevel = (async (req,res)=>{
    let body = req.body
    let createlevel = await level.create({
        name:body.name,
        status:body.status

    })

    if(createlevel){
        res.send({
            'message':'Level Created',
            'data':createlevel,
            'status':true
        })
    }
    else{
        res.send({
            'message':'Level Created Error',
            'status':false
        })
    }
})

const comparePassword = async (password, hash) => {
    try {
      // Compare password
      console.log('password',password);
      console.log('hash',hash)
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.log('error',error)
    }
  
    // Return false if error
    return false
  }

const loginAdmin = (req,res)=>{
    let email = req.body?.email
    let password = req.body?.password

    if(email && password){
        admin.findOne({email:email},async(err,docs)=>{
            if(err){
                res.status(401).send(err)
            }
            else if(docs){
                let checkpassword = await comparePassword(password,docs.password);
                if(checkpassword){
                    const token = generateAccessToken({ email:email,username:docs.firstname });
                    res.send({
                        "message":"log was successful",
                        "status":true,
                        "admin":docs,
                        'token':token
                    })
                }
                else{
                    res.status(401).send({
                        "message":"User not found",
                        "status":false
                    })
                }
            }
            else if(!docs){
                res.status(401).send({
                    "message":"User not found",
                    "status":false
                })
            }
        })
    }
}

const createDiscovery = (async (req,res)=>{
    let creatediscovery = await discover.create({
        "asset_url":req.body.asset_url,
        "title":req.body.title,
        "allotted_time":req.body.allotted_time,
        "type":req.body.type,
        "level":req.body.level,
        "category":req.body.category,
        "status":req.body.status

    })

    if(creatediscovery){
        res.send({
            "message":"Discovery Successfully Created",
            "status":true
        })
    }
    else{
        res.status(400).send({
            "message":"Discovery Creation Failed",
            "status":false
        })
    }
   
})

const allDiscovery = async (req,res)=>{
    let alldata_beginner = await discover.find({level:'Beginner'}).sort({'created_at':-1}).limit(3);
    let alldata_intermidiate = await discover.find({level:'Intermidiate'}).sort({'created_at':-1}).limit(3);
    let alldata_Pro = await discover.find({level:'Pro'}).sort({'created_at':-1}).limit(3);

    if(alldata_beginner){
        res.send({
            "message":"Data Successfully Fetched",
            "data":{
                'beginners':alldata_beginner,
                'intermidiate':alldata_intermidiate,
                'pro':alldata_Pro
            },
            "status":true
        })
    }
    else{
        res.send({
            "message":"Fetch Failed",
            "data":null,
            "status":false

        })
    }
    
}

const createTask = (req,res)=>{
    let title = req.body?.title;
    let duration = req.body?.duration;
    let coach = req.body?.coach.toString();
    let coachid = req.body?.coach.toString();
    let participantType = req.body?.participantType


    task.findOne({title:title},async(err,docs)=>{
        if(err){
            res.status(401).send(err)
        }
        else if(docs){
            res.status(401).send({
                "message":'Task Title Not Unique',
                "status":false
            })
        }
        else if(!docs){
           
            try {
                // Create a new task using the model
                const newTask = await task.create({
                    title:title,
                    duration:duration,
                    coach:coach,
                    coachid:coachid
                });
            
                // Update participant array
            if(participantType === "allusers"){
                users.find({},async(err,docs)=>{
                    if(err){
                        res.status(401).send({
                            "message":err,
                            "status":false
                        })
                    }
                    else if(docs){
                          
                            docs.forEach(element => {
                               
                                newTask.participants.push({
                                    userid: element._id,
                                    name: element.firstname,
                                    emailaddress: element.email,
                                    status: false,
                                    });

                            });
                            const updatedTask = await newTask.save();
                           
                            res.status(201).send({
                                "message":"Task Created",
                                "data":updatedTask,
                                "status":true
                            })
                    }
                    else if(!docs){
                        const updatedTask = await newTask.save();
                        res.status(201).send({
                            "message":'Task Successfully Created with no Participant',
                            "status":true
                        });
                    }
                })

            }

                // newTask.participants.push({
                //   userid: 'participantUserId',
                //   name: 'Participant Name',
                //   emailaddress: 'participant@example.com',
                //   status: 'Pending',
                // });
            
                // Save the updated task with the new participant
                
              } catch (error) {
                res.status(500).send({ "message":error,"status":false });
              }
         
        }
    })
    
}

const allTask = ((req,res)=>{
    
    task.find({},(err,docs)=>{
        if(err){
            res.status(401).send(err)
        }
        else if(docs){
            res.send({
                "message":docs,
                "status":true
            })
        }
    })
})


export {indexpage,createCategory,createLevel,createDiscovery,allDiscovery,createAdmin,createRole,loginAdmin,createTask,createFacilitator,allfacilitator,allTask}