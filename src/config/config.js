var CryptoJS = require("crypto-js");
var dataEncryptionKey = 'mAeUgGaKaDdDaKuGEnC123';
module.exports = {
    ENV: {
        url: process.env.REACT_APP_BASE_URL,

        // Headers
        Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
        x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,

        uploadedImgPath: `${process.env.REACT_APP_ASSETS_BASE_URL}images/`,
        secretKey: process.env.REACT_APP_SECRET_KEY,

        //set user in local storage
        encryptUserData: function (data) {
            data = JSON.stringify(data);
            var encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
            localStorage.setItem('encuse', encryptedUser);
            return true;
        },

        //set active user type in local storage
        encryptActiveUserType: function (data) {
            data = JSON.stringify(data);
            var encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
            localStorage.setItem('aut', encryptedUser);
            return true;
        },

        getRoleId: function () {
            let roleEncrypted = localStorage.getItem('role');
            if (roleEncrypted) {
                let role = '';
                let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
                if (roleDecrypted && roleDecrypted.trim() !== "") {
                    role = JSON.parse(roleDecrypted);
                }
                return role !== '' ? role._id : null;
            }
            return null;
        },

        //get active user type from local storage
        getActiveUserType: function () {
            let userTypeData = localStorage.getItem('aut');
            if (userTypeData) {
                var bytes = CryptoJS.AES.decrypt(userTypeData, dataEncryptionKey);
                var userType = bytes.toString(CryptoJS.enc.Utf8);
                return parseInt(userType);
            }
            return 0;
        },

        //decode passed data
        decodePassedData: function (data) {
            var bytes = CryptoJS.AES.decrypt(data, dataEncryptionKey);
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        },

        //return required keys
        getUserKeys: function (keys = null) {
            let userData = localStorage.getItem('encuse');
            if (userData) {
                var bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
                var originalData = bytes.toString(CryptoJS.enc.Utf8);
                originalData = JSON.parse(originalData);
                let user = {};
                if (keys) {
                    keys = keys.split(" ");
                    for (let key in keys) {
                        let keyV = keys[key];
                        user[keyV] = originalData[keyV];
                    }
                }
                else {
                    user = originalData;
                }
                return user;
            } else {
                return {};
            }

        },

        //clear everything from localstorage
        clearStorage: function () {
            localStorage.removeItem('encuse');
            localStorage.removeItem('aut');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userID');
            localStorage.removeItem('accessToken');
        },

        objectToQueryString: function (body) {
            const qs = Object.keys(body).map(key => `${key}=${body[key]}`).join('&');
            return qs;
        },

        // strong password regex
        strongPassword: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"),
        strongPasswordMsg: 'Password must contain Upper Case, Lower Case , a Special Character , a Number and must be at least 8 characters in length.',

        // strong password regex for student
        stdStrongPassword: new RegExp('^.{8,}$'),
        stdStrongPasswordMsg: 'Password must be of at least 8 characters.',

        // cdn base url
        cdnBaseUrl: 'https://d206oo7zkzq77l.cloudfront.net',

        isValidImageType: function (file) {
            if (file && file.type) {
                const acceptableTypes = ['image/png', 'image/x-png', 'image/jpeg', 'image/jpg']
                return (acceptableTypes.includes(file.type.toLowerCase()))
            }
        },

        integerNumberValidator: function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            const specialKeys = [46, 8, 9, 27, 13]

            // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
            if (specialKeys.includes(e.keyCode) ||
                // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
                ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 90 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },
        decimalNumberValidator: function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            let specialKeys = [46, 8, 9, 27, 13, 110, 190]

            if (e.target.value.includes('.')) {
                specialKeys = [46, 8, 9, 27, 13]
            }
            else {
                specialKeys = [46, 8, 9, 27, 13, 110, 190]
            }

            // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
            if (specialKeys.includes(e.keyCode) ||
                // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
                ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 90 || e.keyCode === 88) && (e.ctrlKey === true || e.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40) ||
                // Allow F1 to F12 keys 
                (e.keyCode >= 112 && e.keyCode <= 123)
            ) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }

        },
        truncTextareaLength: (val, maxlength = 150) => {
            // maxlength = 150

            if (val.length > maxlength) {
                val = (val.substring(0, maxlength)).concat('...')
            } else if ((val.match(/\n/g) || []).length) {
                let values = val.split('\n')

                if (values && values.length && values[0] !== '\n')
                    val = values[0].concat('...')
            }

            return val
        }
    }
}