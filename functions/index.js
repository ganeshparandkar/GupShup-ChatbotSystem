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
    // ????????????????????????????????
    // database trial
    // ---------------------------------------
    // if (startConvo.includes(data.text)) {
    // try {
    //   database.ref(`chatbot/id/${userData.sender.phone}`).set({
    //     id: 1,
    //     name: `${userData.sender.name}`,
    //   });
    //   res.send('added');
    // } catch (error) {
    //   res.send(error.toString());
    // }
    // } else {
    // try {
    //  ?working
    // var ref = database.ref(`chatbot/id/${userData.sender.phone}/id`);
    // ref.on(
    //   'value',
    //   (snapshot) => {
    //     mycount = snapshot.val();
    //   },
    //   (errorObject) => {
    //     console.log('The read failed: ' + errorObject.code);
    //   }
    // );
    // res.send(mycount.toString());
    // } catch (error) {
    //   res.send(error.toString());
    // }
    // ?update code working
    // try {
    //   database.ref(`chatbot/id/${userData.sender.phone}`).update({
    //     id: 2,
    //   });
    //   res.send('updated');
    // } catch (error) {
    //   res.send(error.toString());
    // }
  }

  // ????????????????????????????????

  // !

  // if no. is exist then check the count if no. is not exist then create the count
  // if (data.text == 'count') {
  //   try {
  //     var ref = database.ref(`chatbot/id/${userData.sender.phone}/count`);
  //     ref.on(
  //       'value',
  //       (snapshot) => {
  //         mycount = snapshot.val();
  //       },
  //       (errorObject) => {
  //         console.log('The read failed: ' + errorObject.code);
  //       }
  //     );
  //     console.log(mycount);
  //     res.send(mycount);
  //   } catch (error) {
  //     res.send(error.toString());
  //   }
  // }

  if (startConvo.includes(data.text)) {
    try {
      database.ref(`chatbot/id/${userData.sender.phone}`).set({
        count: 1,
        name: `${userData.sender.name}`,
        phone: `${userData.sender.phone}`,
      });
      res.send('Hi \n Enter pincode');
    } catch (error) {
      res.send(error.toString());
    }
  }
  // read pincode
  if (data.text.length === 6) {
    pincode = data.text;
    // save pincode to the databasse
    try {
      database
        .ref(`chatbot/id/${userData.sender.phone}`)
        .update({
          count: 2,
          pincode: `${pincode}`,
        })
        .then(
          res.send(`Thanks, here is today's menu. Please let us know what you want, make sure you enter the item number and qty.\n
      1 - Product 1 \n
      2 - Product 2 \n
      3 - Product 3\n
      please enter number input`)
        )
        .catch((e) => {
          res.send(e.toString());
        });
    } catch (error) {
      res.send(error.toString());
    }
  }

  if (data.text.length > 3) {
    var mycount;
    
    var ref = database.ref(`chatbot/id/${userData.sender.phone}/id`);
    ref.on(
      'value',
      (snapshot) => {
        mycount = snapshot.val();
      },
      (errorObject) => {
        console.log('The read failed: ' + errorObject.code);
      }
    );
    res.send(mycount.toString());

    mycount = parseInt(mycount.toString());
    
    if(mycount == 2){
      // read for input and ask for quantity  
      res.send('enter the quantity')
    }
    if (mycount == 3) {
      // read for quaantity
      res.send("enter the address")
    }
  }

  // !

  // get the value of count variable

  /* -----
 database fetching code 
-------*/
  // var ref = database.ref(`chatbot/id/${userData.sender.phone}/count`);
  // ref.on(
  //   'value',
  //   (snapshot) => {
  //     xyz = snapshot.val();
  //   },
  //   function (errorObject) {
  //     console.log('The read failed: ' + errorObject.code);
  //   }
  // );
  // res.send(`this is the response ${xyz}`);

  /* -----
 database setting done here
-------*/

  // database.ref(`chatbot/id/${userData.sender.phone}`).set({
  //   count: 5,
  //   name: userData.sender.name,
  //   phoneNumber: userData.sender.phone,
  // });

  // var result = 'dontknow';
  // res.send('trying to connect the database wait for the message');
  // if (req.data.text === 'hi') {
  //   try {
  //     res.send('started');
  //     database.ref('chatbot/id').set({
  //       count: 2,
  //     });
  //     result = 'success';
  //     res.send(result);
  //   } catch (error) {
  //     res.send(error);
  //   }
  // }

  // const pincode, itemId, itemQuantity, address;
  // let qcount = 0;
  // const data = req.body.payload.payload;

  /* --------
    1sst case
     ----------*/
  // switch (qcount) {
  //   case 0:

  // ?
  // if (
  //   data.text === 'hi' ||
  //   data.text === 'Hi' ||
  //   data.text === 'hii' ||
  //   data.text === 'Hii'
  // ) {
  //   qcount = 1;
  //   res.send(`${qcount} Hi, Please provide the PIN Code.`);
  // }

  // ?
  //     break;
  //   case 1:

  //     break;
  //   case 0:

  //     break;
  //   case 0:

  //     break;
  //   case 0:

  //     break;

  //   default:
  //     break;
  // }

  /* --------
    2nd case
     ----------*/

  // if (data.text.length === 6) {
  //   qcount = 2;
  //   pincode = data.text;
  //   res.send(`${qcount} Thanks, here is today's menu. Please let us know what you want, make sure you enter the item number and qty.\n
  //   1 - Product 1 \n
  //   2 - Product 2 \n
  //   3 - Product 3\n
  //   please enter number input`);
  // }
  /* --------
    3rd case
     ----------*/
  // if (data.text.length === 1) {
  //   var checkinput = parseInt(data.text);
  //   res.send(`Please enter quantity`);
  // }
  /* --------
    4th case
     ----------*/

  //  user sends the quantity read that and ask for address

  /* --------
    5th case
     ----------*/

  //  user sends the qddress read that and send thank you response

  // res.send(data.payload.sender.phone);
});

// ? for reference
// ? when user sends message to the bot
// const data = [
//   {
//     app: 'DevSquare',
//     timestamp: 1611901109395,
//     version: 2,
//     type: 'message',
//     payload: {
//       id: 'ABEGkYQheTRnAhCrlA6beoBEc6hm4sGG5FDJ',
//       source: '918421793467',
//       type: 'text',
//       payload: { text: 'Sorry 😂😂' },
//       sender: {
//         phone: '918421793467',
//         name: 'Shriyash ✌🏻',
//         country_code: '91',
//         dial_code: '8421793467',
//       },
//     },
//   },
// ];

// ? json
// const userData = [
//   {
//     pincode : 402144,
//     itemid: 2,
//     itemQuantity: 10,
//     address:"blablablabstreetd 20031"
//   }
// ]
