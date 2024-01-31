=> initial setup

=> auth
window.btoa(JSON.stringify(str)) // encryption
window.atob(JSON.stringify(str)) // decryption

=> login
str = { "email": "help@xyz.com", "password": "Xyz@1234" }

=> reset password // otp should be verified
'{"email":"help@xyz.com","newPassword":"Xyz@12345"}'

=> change password
'{"email":"help@xyz.com","password":"Xyz@12345","newPassword":"Xyz@123456"}'

=> update user (first call from signup)
password pass as secret_key field in encrypted form
