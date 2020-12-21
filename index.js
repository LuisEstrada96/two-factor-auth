const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const app = express();
const port = "8900";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/register', (req, res) => {
    const secret = speakeasy.generateSecret({ name: "NAHA" });
    QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if(err || !dataUrl)
            return reject(err)
        res.json({ secret: secret.base32, qrCode: dataUrl})
    });
})

app.post("/verify", (req, res) => {
    const { secret, token } = req.body;
    // TODO Save secret in DB for validate
    const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
    });
    res.json( verified );
})

app.get("/validate/:token/:secret", (req, res) => {
    const { token, secret } = req.params;
    //TODO Find secret in DB for userId
    const tokenValidates = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
    });

    res.json( tokenValidates );
})

app.listen(port, ()=>{
    console.log('server listening on port '+ port)
})