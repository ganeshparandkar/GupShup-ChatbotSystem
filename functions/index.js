/* -----
Declaration Part
-------*/
const functions = require('firebase-functions');
const admin = require('firebase-admin');

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

  const startConvo = [
    'hi',
    'Hi',
    'hii',
    'hello',
    'Hii',
    'Hello',
    'Hey',
    'Heyy',
  ];

  /* -----
    Logical programming starts
-------*/
  if (req.method == 'POST') {
    var cval;

    // !

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
