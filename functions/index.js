/* -----
Declaration Part
-------*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const keys = require('./key.json');

/* -----
Spreadsheet connectivity
-------*/
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return; // just get out from the function
  } else {
    console.log('Connected');
    gsrun(client);
  }
});

const gsrun = async (cl) => {
  const gsapi = google.sheets({
    version: 'v4',
    auth: cl,
  });

  // const options = {
  //   spreadsheetId: '1WOcA5K6oZt3murmZMW-00P0GXwrJ2TBKhQfKxPISTGU',
  //   range: 'Data!A1:B11',

  // };
  const options = {
    spreadsheetId: '19otL8gAQTUIYr63Td-v41u7RtvWuMSq2fP1QXCk2gEY',
    range: 'Sheet1!A3:C6',
  };

  let data = await gsapi.spreadsheets.values.get(options);
  let dataArray = data.data.values; // array is stored from json to var
  console.log(dataArray);

  // * updation
  const update = {
    //* for updation putting data into sheets
    spreadsheetId: '19otL8gAQTUIYr63Td-v41u7RtvWuMSq2fP1QXCk2gEY',
    range: 'Sheet1!G1',
    valueInputOption: 'USER_ENTERED',
    resource: { values: dataArray },
  };

  let res = await gsapi.spreadsheets.values.update(update);
  // console.log(res);
  // * performing some operations on array according our needs
  // let newDataArray = dataArray.filter((row) => {
  //   return row;
  // });
  // console.log(newDataArray);
};

// !-------------------------------------------------------------------------------------
/* -----
 database initialization and setup
-------*/
// dont touch this

admin.initializeApp({
  databaseURL: 'https://ct-chat-bot-2021-default-rtdb.firebaseio.com',
});
var database = admin.database();

// https function
exports.apicall = functions.https.onRequest((req, res) => {
  const data = req.body.payload.payload;
  const userData = req.body.payload;
  const inputdata = data.text;

  // check if user exist  if exist then check count or just follow the sequence
  // removal timeout and sequential code
  // read excel sheet from drive

  // const startConvo = [
  //   'hi',
  //   'Hi',
  //   'hii',
  //   'hello',
  //   'Hii',
  //   'Hello',
  //   'Hey',
  //   'Heyy',
  // ];

  /* -----
    Logical programming starts
-------*/
  if (req.method == 'POST') {
    var cval;

    if (startConvo.includes(data.text)) {
      database.ref(`chatbot/${userData.sender.phone}`).set({
        count: 1,
        name: `${userData.sender.name}`,
        phone: `${userData.sender.phone}`,
      });
      res.send('Hi, Please provide the PIN Code.');
    }

    if (inputdata.length > 7) {
      database
        .ref('chatbot')
        .child(userData.sender.phone)
        .child('Address')
        .set(inputdata);
      database
        .ref('chatbot')
        .child(userData.sender.phone)
        .child('count')
        .set(6);
      res.send('Thanks for contacting us.');
    }
    if (!isNaN(inputdata)) {
      database
        .ref('chatbot')
        .child(`${userData.sender.phone.toString()}`)
        .on('value', (snapshot) => {
          // console.log(typeof snapshot.val().id);
          cval = snapshot.val().count;
        });

      setTimeout(() => {
        if (cval == 4) {
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('count')
            .set(5);
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('itemquantity')
            .set(inputdata);
          res.send(res.send(`Ok great. Please let us know your address.`));
        }
        if (cval == 3) {
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('count')
            .set(4);
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('itemId')
            .set(inputdata);
          res.send(`Please enter quantity`);
        }

        if (inputdata.length === 6 && cval == 1) {
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('pincode')
            .set(inputdata);
          database
            .ref('chatbot')
            .child(userData.sender.phone)
            .child('count')
            .set(3);
          res.send(`Thanks, here is today's menu. Please let us know what you want, \n
          make sure you enter the item number and qty.
          1 - Product 1\n
          2 - Product 2\n
          3 - Product 3`);
        }
      }, 2000);
    }
  }
});
