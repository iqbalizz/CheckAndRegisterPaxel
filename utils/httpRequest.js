import fetch from "node-fetch";

export const getOtpRequest = async (inputNomer, xPlayer) => {
    try {
        const dataString = `{"phone":"${inputNomer}"}`
        const res = await fetch(`https://api.paxel.co/apg/api/v1/me/phone-token?on=register`, {
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
        const data = await res.json();
        return data;

    } catch (error) {
        throw (error)
    }
};

export const getValidateOtp = async (inputNomer, inputOtp, xPlayer) => {
    try {
        const dataString = `{"phone":"${inputNomer}","token":"${inputOtp}"}`
        const res = await fetch(`https://api.paxel.co/apg/api/v1/me/phone-token/validate`, {
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
        const data = res.json();
        return data
    } catch (error) {
        throw (error)
    }
};

export const getRegisterAcc = async (maskingNumber, inputPIN, inputNomer, sendBy, inputOtp, xPlayer) => {
    try {
        const dataString = `{"masking_number":"${maskingNumber}","pin":"${inputPIN}","phone":"${inputNomer}","send_by":"${sendBy}","confirmed_pin":"${inputPIN}","token":"${inputOtp}"}`
        const res = await fetch(`https://api.paxel.co/apg/api/v3/register`, {
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
        const data = res.json();
        return data;
    } catch (error) {
        throw (error)
    }
};

//!Login Account
export const getLogin = async (inputPinLogin, inputNomerLogin, xPlayer) => {
    try {
        const dataString = `{"pin":"${inputPinLogin}","phone":"${inputNomerLogin}"}`
        const res = await fetch(`https://api.paxel.co/apg/api/v3/login`, {
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
        const data = res.json();
        return data;
    } catch (error) {
        throw (error)
    }
};

export const getBalance = async (xPlayer, token) => {
    try {
        const res = await fetch(`https://api.paxel.co/apg/api/v1/me/balance`, {
            headers: {
                'Host': 'api.paxel.co',
                'Content-Type': 'application/json',
                'X-Version': '2.18.2',
                'Device-Id': '02:00:00:00:00:00',
                'Device-Type': 'Phone',
                'X-Player': xPlayer,
                'Authorization': `Bearer ${token}`,
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'okhttp/4.7.2'
            },
        })
        const data = res.json();
        return data;
    } catch (error) {
        throw (error)
    }
};

export const getVoucher = async (token) => {
    try {
        const res = await fetch(`https://cmsrevampapi.paxel.co/api/webview/v1/promo/vouchers`, {
            headers: {
                'Host': 'cmsrevampapi.paxel.co',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Android;Mobile',
                'Origin': 'https://webview.paxel.co',
                'X-Requested-With': 'com.paxel',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://webview.paxel.co/',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'id,en-US;q=0.9,en;q=0.8'
            }
        })
        const data = res.json();
        return data;
    } catch (error) {
        throw (error)
    }
};