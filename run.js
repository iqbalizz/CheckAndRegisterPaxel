import fetch from "node-fetch";
import chalk from "chalk";
import readlineSync from "readline-sync";
import { v4 as uuidv4 } from "uuid";
import inquirer from "inquirer";
// import { getOtpRequest, getValidateOtp, getRegisterAcc, getLogin } from "./utils/httpRequest.js";
import { getOtpRequest, getValidateOtp, getRegisterAcc, getLogin, getBalance, getVoucher } from "./utils/httpRequest.js";
import { banner1, banner2, banner3, banner4, banner } from "./utils/banner.js";

(async () => {
    console.log(`${chalk.green(banner())}`)
    const pilihan1 = `[1] ${chalk.green(`Register Account Paxel`)}`;
    const pilihan2 = `[2] ${chalk.green(`Login Account Paxel`)}`
    console.log(`${pilihan1}\n${pilihan2}`)
    let inputPilihan;
    let isValid = false
    while (!isValid) {
        inputPilihan = readlineSync.questionInt(`[?] Masukkan pilihan (1/2) : `)
        if (inputPilihan !== 1 && inputPilihan !== 2) {
            console.log(`[!] ${chalk.red(`Harus memilih 1 atau 2`)}`);
        } else {
            isValid = true;
        }
    }
    if (inputPilihan === 1) {
        console.log(banner1())
        //!generate Xplayer
        const xPlayer = uuidv4();
        //!Input User
        const inputNomer = readlineSync.question(`[?] Masukkan Nomer Kamu : `)
        const resultOtpRequest = await getOtpRequest(inputNomer, xPlayer);
        // console.log(resultOtpRequest)
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
                console.log(`[!] ${chalk.red(`Gagal Menginputkan PIN! Masukkan code OTP yang benar!`)}`)
            }
        } else {
            console.log(`[!] ${chalk.red(`Gagal mengirim OTP!`)}`)
        }
    } else if (inputPilihan === 2) {
        console.log(banner2());
        //!generate Xplayer
        const xPlayer = uuidv4();
        const inputNomerLogin = readlineSync.question(`[?] Masukkan Nomer Kamu Untuk Login : `);
        const inputPinLogin = readlineSync.question(`[?] Masukkan PIN Account : `)
        const resultLogin = await getLogin(inputPinLogin, inputNomerLogin, xPlayer)
        const statusLogin = resultLogin.code_message;
        if (resultLogin.code === 200) {
            console.log(`[!] ${chalk.green(statusLogin)}`)
            const token = resultLogin.data.api_token;
            while (true) {
                const answer = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'selectedOption',
                        message: 'Pilih salah satu opsi:',
                        choices: [
                            'Cek Profile Akun Dan Balance',
                            'Check Voucher',
                            `Keluar`
                        ]
                    }
                ]);
                if (answer.selectedOption === 'Keluar') {
                    console.log(`[!] ${chalk.red(`Keluar dari program`)}`);
                    break;
                }
                if (answer.selectedOption === 'Cek Profile Akun Dan Balance') {
                    const resultBalance = await getBalance(xPlayer, token);
                    const balance = resultBalance.data.balance;
                    const promoBalance = resultBalance.data.promo_balance;
                    console.log(banner3());
                    console.log(`[!] Saldo Akun Tersedia : ${chalk.green(balance)}`);
                    console.log(`[!] Promo Balance : ${chalk.green(promoBalance)}`);
                    console.log();
                } else if (answer.selectedOption === 'Check Voucher') {
                    console.log(banner4());
                    const resultVoucher = await getVoucher(token);
                    resultVoucher.data.coupons.forEach((voucher, index) => {
                        const value = voucher.value;
                        const namaVoucher = voucher.attributes.OfferValue;
                        const descVoucher = voucher.attributes.DescriptionIn;
                        const maxDiscount = voucher.attributes.MaxAmount;
                        // console.log(voucher);
                        console.log(`[!] ${chalk.yellow(`Voucher Paxel ${index + 1}`)}`)
                        console.log(`[!] Title Voucher ${index + 1} : ${chalk.green(value)}`);
                        console.log(`[!] Nama Voucher : ${chalk.green(namaVoucher)}`);
                        console.log(`[!] Deskripsi Voucher : ${chalk.yellow(descVoucher)}`);
                        console.log(`[!] Max Discount Voucher : ${chalk.green(maxDiscount)}`);
                        console.log();
                    })
                }
            }
        }
    }

})();