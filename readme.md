server side languange = NodeJs using typescript

userRoles = ['customer', 'admin', 'agent']
byDefault user role will be 'customer'
loanStates = ["NEW", "REJECTED", "APPROVED"]

For incrypting password 'bcrypt library' used with salt equals to 12
For tokens 'json web token' are used as a 'Bearer token'

All cases are tested using 'supertest' and 'jest';

Test cases -

1. User can up signup with only with valid datam such as email, password, confirmPassword -
2. List, view and edit users - this can only be done by "agent" and "admin" roles
3. Only user and agent on behalf of use can create loan request.
   for date handling 'UTC' format is used.
   loanObject lookslike
   e.g.
   {
   "status": "NEW",
   "history": [],
   "loanId": "60361c86a23f3e35446d1d09",
   "userId": "6035ef192658653fd0ea832a",
   "loan": {
   "id": "60361c86a23f3e35446d1d09",
   "loanId": "60325a58f4ae643ee4c2417f",
   "clientId": "6035ef192658653fd0ea832a",
   "name": "user",
   "principle": 500000,
   "type": "personal loan",
   "status": "NEW",
   "emi": 10138,
   "duration_in_months": 60,
   "rate": 8,
   "paid_amount": 0,
   "start_date": "2021-02-24T09:29:42.424Z",
   "end_date": "2026-02-24T09:29:42.424Z"
   },
   "createdAt": "2021-02-23T09:29:42.553Z",
   "updatedAt": "2021-02-23T09:29:42.553Z",
   "\_\_v": 0,
   "id": "60361c86a23f3e35446d1d0a"
   },

4) All loans can be accessed by admin, agent only
5) User can acces its own loans
   user object
   e.g.
   {
   "user": {
   "role": "customer",
   "loans": [
   {
   "id": "60361c86a23f3e35446d1d09",
   "loanId": "60325a58f4ae643ee4c2417f",
   "clientId": "6035ef192658653fd0ea832a",
   "agentId": null,
   "name": "user",
   "principle": 500000,
   "type": "personal loan",
   "status": "NEW",
   "emi": 10138,
   "duration_in_months": 60,
   "rate": 8,
   "paid_amount": 0,
   "start_date": "2021-02-24T09:29:42.424Z",
   "end_date": "2026-02-24T09:29:42.424Z"
   },
   {
   "id": "60361cb7a23f3e35446d1d0b",
   "loanId": "60325a58f4ae643ee4c2417f",
   "clientId": "6035ef192658653fd0ea832a",
   "agentId": null,
   "name": "user",
   "principle": 250000,
   "type": "personal loan",
   "status": "APPROVED",
   "emi": 9222,
   "duration_in_months": 30,
   "rate": 8,
   "paid_amount": 0,
   "start_date": "2021-02-24T09:30:31.703Z",
   "end_date": "2023-08-24T09:30:31.703Z"
   }
   ],
   "payment_history": [],
   "active": true,
   "name": "sagar pawar",
   "email": "user@test.com",
   "createdAt": "2021-02-24T06:15:53.800Z",
   "updatedAt": "2021-02-24T09:30:53.814Z",
   "passwordUpdatedAt": "2021-02-24T06:15:54.232Z",
   "\_\_v": 7,
   "id": "6035ef192658653fd0ea832a"
   },
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMzVlZjE5MjY1ODY1M2ZkMGVhODMyYSIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTYxNDIzNzM4NywiZXhwIjoxNjE0ODQyMTg3fQ.xhPdyWijXPmKZduGt-NakTvRKZIWGsObMWM49nRpBhQ"
   }

6) Only Agent can update loan only if loan is not approved
7) Loan can aprroved by admin only.
8) All loans can be filtered by agent and admin only;
   filter queries are - 'createdAt', 'updatedAt', 'status'
