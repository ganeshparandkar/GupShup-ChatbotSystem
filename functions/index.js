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
    // !

    if (startConvo.includes(data.text)) {
      database.ref(`chatbot/${userData.sender.phone}`).set({
        count: 1,
        name: `${userData.sender.name}`,
        phone: `${userData.sender.phone}`,
      });
      res.send('Hi \n Enter pincode');
    }

    if (!isNaN(inputdata)) {
      let cval;

      database
        .ref('chatbot')
        .child(`${userData.sender.phone.toString()}`)
        .on('value', (snapshot) => {
          // console.log(typeof snapshot.val().id);
          cval = snapshot.val().count;
        });

      if (inputdata.length === 6) {
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('pincode')
          .set(inputdata);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('count')
          .set(2);
        res.send(
          `pincode is set ${inputdata} \n now enter item no and value of count is ${cval} and type of cval is ${typeof cval}`
        );
      }

      if (inputdata.length < 3) {
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('count')
          .set(3);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('itemId')
          .set(inputdata);
        res.send(
          `you have selected ${inputdata}  item.\n now enter item quantity`
        );
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
          .child('itemquantity')
          .set(inputdata);
        res.send(`you ordered ${inputdata} items.\n now enter the address`);
      }
    }
  }
});
