import fetch from "node-fetch";
import chalk from "chalk";
import readlineSync from "readline-sync";
import { v4 as uuidv4 } from "uuid";

const getOtpRequest = (inputNomer, xPlayer) => new Promise((resolve, reject) => {
    const dataString = `{"phone":"${inputNomer}"}`
    fetch(`https://api.paxel.co/apg/api/v1/me/phone-token?on=register`, {
        method: 'POST',
        headers: {
            'Host': 'api.paxel.co',
            'X-Version': '2.18.2',
            'Device-Id': '02:00:00:00:00:00',
            'Device-Type': 'Phone',
            'X-Player': xPlayer,
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '25',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/4.7.2'
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getValidateOtp = (inputNomer, inputOtp, xPlayer) => new Promise((resolve, reject) => {
    const dataString = `{"phone":"${inputNomer}","token":"${inputOtp}"}`
    fetch(`https://api.paxel.co/apg/api/v1/me/phone-token/validate`, {
        method: 'POST',
        headers: {
            'Host': 'api.paxel.co',
            'X-Version': '2.18.2',
            'Device-Id': '02:00:00:00:00:00',
            'Device-Type': 'Phone',
            'X-Player': xPlayer,
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '40',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/4.7.2'
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

const getRegisterAcc = (maskingNumber, inputPIN, inputNomer, sendBy, inputOtp, xPlayer) => new Promise((resolve, reject) => {
    const dataString = `{"masking_number":"${maskingNumber}","pin":"${inputPIN}","phone":"${inputNomer}","send_by":"${sendBy}","confirmed_pin":"${inputPIN}","token":"${inputOtp}"}`
    fetch(`https://api.paxel.co/apg/api/v3/register`, {
        method: 'POST',
        headers: {
            'Host': 'api.paxel.co',
            'X-Version': '2.18.2',
            'Device-Id': '02:00:00:00:00:00',
            'Device-Type': 'Phone',
            'X-Player': xPlayer,
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '130',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/4.7.2'
        },
        body: dataString
    })
        .then(res => resolve(res.json()))
        .catch(error => reject(error))
});

(async () => {
    //!generate Xplayer
    const xPlayer = uuidv4();
    //!Input User
    const inputNomer = readlineSync.question(`[?] Masukkan Nomer Kamu : `)
    const resultOtpRequest = await getOtpRequest(inputNomer, xPlayer);
    const getData = resultOtpRequest.data;
    const message = resultOtpRequest.code_message;
    const maskingNumber = getData.masking_number;
    const sendBy = getData.send_by;
    const statusOtp = `Otp ${chalk.green(message)} send by ${chalk.green(sendBy)} with number ${chalk.green(maskingNumber)}`
    if (resultOtpRequest.code === 200) {
        console.log(`[!] ${statusOtp}`)
        const inputOtp = readlineSync.question(`[?] Masukkan kode OTP : `)
        const validateOtp = await getValidateOtp(inputNomer, inputOtp, xPlayer)
        const status = validateOtp.code_message;
        if (validateOtp.code === 200) {
            console.log(`[!] ${chalk.green(status)}.. Buat PIN Kamu`);
            const inputPIN = readlineSync.question(`[?] Masukkan PIN Kamu : `)
            const resultRegisterAcc = getRegisterAcc(maskingNumber, inputPIN, inputNomer, sendBy, inputOtp, xPlayer)
            const statusRegister = resultRegisterAcc.code_message;
            if (resultRegisterAcc.code === 200) {
                console.log(`[!] ${chalk.green(statusRegister)}! ${chalk.green(`Register Succesfully`)}`)
            } else {
                console.log(`[!] ${chalk.red(`Register Gagal!`)}`)
            }
        } else {
            console.log(`[!] ${chalk.red(`Gagal Menginputkan PIN!`)}`)
        }
    } else {
        console.log(`[!] ${chalk.red(`Gagal mengirim OTP!`)}`)
    }
})();