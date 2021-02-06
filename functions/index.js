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
var sheetData = [];
var sheetProducts = [];
const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

client.authorize((err, tokens) => {
  if (err) {
    console.log(err);
    return; // just get out from the function
  } else {
    console.log('Connected');
    gsrun(client).then((data) => {
      sheetData = data[0];
      sheetProducts = data[1];
    });
  }
});

/* -----
database connectivity
-------*/

var gsrun = async (cl) => {
  const gsapi = google.sheets({
    version: 'v4',
    auth: cl,
  });

  const options = {
    spreadsheetId: '1PorRlxlCbXveAtXBicBGfn6UFGVt9VZ5hqDtyBzOW9Q', // pincode and address sheet
    range: 'Sheet1!A1:B100',
  };

  const productSheet = {
    spreadsheetId: '1kK2_2s3kwhAzK2LrwFfOFXZWl45WD-wr0fSgOpqrgDw', // pincode and address sheet
    range: 'Sheet1!A1:C100',
  };

  let data = await gsapi.spreadsheets.values.get(options);
  let dataArray = data.data.values;

  let products = await gsapi.spreadsheets.values.get(productSheet);
  let productArr = products.data.values;

  let sheets = [dataArray, productArr];

  return sheets;
};

admin.initializeApp({
  databaseURL: 'https://ct-chat-bot-2021-default-rtdb.firebaseio.com',
});
var database = admin.database();

// !-------------------------------------------------------------------------------------
/* -----
 database initialization and setup
-------*/
// dont touch this

// https function
exports.apicall = functions.https.onRequest((req, res) => {
  function checkPin(inputpin) {
    let pincodeslocal = [];
    sheetData.map((e) => {
      pincodeslocal.push(e[0]);
    });
    console.log(pincodeslocal);
    if (pincodeslocal.includes(inputpin.toString())) {
      let placesAtPincode = '';
      let index = pincodeslocal.indexOf(inputpin.toString());
      placesAtPincode = sheetData[[index]][1];
      console.log('index is ', index);
      console.log('infunction ', placesAtPincode);
      return placesAtPincode;
    } else {
      return 'NotFound';
    }
  }

  const data = req.body.payload.payload;
  const userData = req.body.payload;
  const inputdata = data.text;
  const menuCard = [
    {
      type: 'image',
      originalUrl:
        'https://image.freepik.com/free-vector/vector-cartoon-illustration-design-fast-food-restaurant-menu_1441-334.jpg',
      previewUrl:
        'https://image.freepik.com/free-vector/vector-cartoon-illustration-design-fast-food-restaurant-menu_1441-334.jpg',
      caption: 'Sample image',
    },
    'Please enter ItemId and quantity',
  ];

  // context.sendResponse(JSON.stringify(image));
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
    // let date = new Date();

    database
      .ref('chatbot')
      .child(`${userData.sender.phone.toString()}`)
      .on('value', (snapshot) => {
        // console.log(typeof snapshot.val().id);
        cval = snapshot.val().count;
      });
    if (startConvo.includes(data.text)) {
      database.ref(`chatbot/${userData.sender.phone}`).set({
        count: 1,
        name: `${userData.sender.name}`,
        phone: `${userData.sender.phone}`,
      });
      res.send(`Hello ${userData.sender.name},\nPlease provide the PIN Code.`);
    }

    setTimeout(() => {
      if (inputdata.length > 7 && cval == 6) {
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('Address')
          .set(inputdata);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('count')
          .set(7);
        saveData(userData.sender.phone);
        res.send('Thanks for contacting us.');
      }
      if (cval == 5) {
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('count')
          .set(6);

        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('CuttingStyle')
          .set(inputdata);
        res.send(res.send(`Thanks,Please let us know your address`));
      }
      if (cval == 4) {
        var productArr = inputdata.split(' ');
        // map those spit items and fetch sheet data according to it
        console.log(productArr);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('count')
          .set(5);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('ProductId')
          .set(productArr[0]);
        database
          .ref('chatbot')
          .child(userData.sender.phone)
          .child('ProductQuantity')
          .set(productArr[1]);
        res.send(res.send(`Thanks, How would you like the cut for ?`));
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
          .child('areaCode')
          .set(inputdata);
        res.send(menuCard);
      }
      if (inputdata.length === 6 && cval == 1) {
        // check spreadsheet data includes pincode or not
        var cityPoints = checkPin(inputdata);
        console.log(`outside the function ${cityPoints}`);

        if (cityPoints != 'NotFound') {
          res.send(
            `We serve the following areas,\n ${cityPoints.toString()},\n please choose an area.`
          );
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
        } else {
          res.send('We dont provide out services to this address');
        }
      }
    }, 2000);

    async function saveData(phoneNo) {
      var today = new Date();
      var date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      var orderDate = date + ' ' + time;

      let customerName,
        customerPhone,
        productID,
        productQuantity,
        pincode,
        address,
        areaCode,
        cuttingStyle;
      let saveDataArray = [];

      function first(callback) {
        database
          .ref('chatbot')
          .child(phoneNo)
          .on('value', (snapshot) => {
            // console.log(typeof snapshot.val().id);
            customerName = snapshot.val().name;
            customerPhone = snapshot.val().phone;
            productID = snapshot.val().ProductId;
            productQuantity = snapshot.val().ProductQuantity;
            pincode = snapshot.val().pincode;
            address = snapshot.val().Address;
            areaCode = snapshot.val().areaCode;
            cuttingStyle = snapshot.val().CuttingStyle;
          });
        let product = productID + ' | ' + productQuantity;
        saveDataArray = [
          customerPhone,
          orderDate,
          customerName,
          product,
          cuttingStyle,
          address,
          pincode,
          areaCode,
          'New',
        ];
        callback();
      }

      function second() {
        const client = new google.auth.JWT(
          keys.client_email,
          null,
          keys.private_key,
          ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize((err, tokens) => {
          if (err) {
            console.log(err);
            return; // just get out from the function
          } else {
            console.log('Connected');
            gsrun(client);
          }
        });
        var gsrun = async (cl) => {
          const gsapi = google.sheets({
            version: 'v4',
            auth: cl,
          });

          const options = {
            spreadsheetId: '1E8ZYti2gunPZkybHtlBElEW4rFITwmXRz3Pbn3dLbEo',
            range: 'Sheet1!A1:I100',
          };

          let data = await gsapi.spreadsheets.values.get(options);
          let oldUserLogs = data.data.values;
          oldUserLogs.push(saveDataArray);

          // * updation
          const update = {
            spreadsheetId: '1E8ZYti2gunPZkybHtlBElEW4rFITwmXRz3Pbn3dLbEo',
            range: 'Sheet1!A1:I100',
            valueInputOption: 'USER_ENTERED',
            resource: { values: oldUserLogs },
          };

          let res = await gsapi.spreadsheets.values.update(update);
          console.log(res);
        };
      }

      first(second);
    }
  }
});
