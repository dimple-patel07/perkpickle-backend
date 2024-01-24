=> Clone & Start
git clone https://github.com/dimple-patel07/perkpickle-backend.git
cd perkpickle-backend // don't forget to .env (Dot ENV)
npm install
npm start

=> Card Api

1. GET http://localhost:3300/spendBonusCategoryList

2. POST http://localhost:3300/spendBonusCategoryCard
   {"spendBonusCategoryId": <category-id>}

3. POST http://localhost:3300/cardDetailByCardKey
   {"cardKey": "citi-thankyoupreferred"}

4. POST http://localhost:3300/getCardImage
   {"cardKey": "comenity-aaadaily"}

5. GET http://localhost:3300/getAllCards

=> User api

1. POST http://localhost:3300/createUser
   {"email":"help@xyz.com"}

2. POST http://localhost:3300/verifyUser
   {"email":"help@xyz.com", otp: 123456}

3. POST http://localhost:3300/updateUser
   {"email":"help@xyz.com", "first_name": "xyz", "last_name": "xyz", "zip_code": 73201, "address": "NY US", "phone_number": "1(123)555-3890", "password": "xyz@123"}

4. POST http://localhost:3300/resendOtp
   {"email":"help@xyz.com"}

5. POST http://localhost:3300/getUserByEmail
   {"email":"help@xyz.com"}

=> auth api

1. POST http://localhost:3300/login
   {"email":"help@xyz.com", "password": "xyz@123"}

2. POST http://localhost:3300/forgotPassword
   {"email":"help@xyz.com"}

3. POST http://localhost:3300/verifyUser
   {"email":"help@xyz.com", otp: 123456}

4. POST http://localhost:3300/resetPassword
   {"email":"help@xyz.com", newPassword: "abc@123""}

5. POST http://localhost:3300/changePassword
   {"email":"help@xyz.com", "password": "xyz@123", newPassword: "abc@123""}
