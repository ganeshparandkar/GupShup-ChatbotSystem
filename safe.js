const functions = require('firebase-functions');
const axios = require('axios');
// const express = require('express');
// const cors = require('cors');
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello this is express app');
// });

// app.post('/sendtext', (req,res)=>{

// })

exports.user = functions.https.onRequest(app);

exports.apicall = functions.https.onRequest((req, res) => {
  if (req.method == 'GET') {
    res.send(
      " curl -X POST https://api.gupshup.io/sm/api/v1/msg \
          -H 'Cache-Control: no-cache' \
          -H 'Content-Type: application/x-www-form-urlencoded' \
          -H 'apikey: qcmzcorwbmrx8fezzg6qm09maypolahx' \
          -H 'cache-control: no-cache' \
          -d 'channel=whatsapp&source=917834811114&destination=91&message=%7B%22type%22:%22text%22,%22text%22:%22%22%7D&src.name=DevSquare' "
    );
  } else {
    console.log('POST request is getting executed');

    const url = 'https://api.gupshup.io/sm/api/v1/msg';
    const data = {
      apikey: 'qcmzcorwbmrx8fezzg6qm09maypolahx',
      channel: 'whatsapp',
      source: 917834811114,
      destination: 918421793467,
      message: { type: 'text', text: 'hieee there' },
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: 'qcmzcorwbmrx8fezzg6qm09maypolahx',
      },
      body: JSON.stringify(data),
    });
    // axios({
    //   method: 'post',
    //   url: 'https://api.gupshup.io/sm/api/v1/msg',
    //   data: {
    //     apikey: 'qcmzcorwbmrx8fezzg6qm09maypolahx',
    //     channel: 'whatsapp',
    //     source: 917834811114,
    //     destination: 918421793467,
    //     message: { type: 'text', text: 'hieee there' },
    //   },
    //   Headers: {
    //     apikey: 'qcmzcorwbmrx8fezzg6qm09maypolahx',
    //   },
    // });
    console.log('operation done message sent');
  }
  //   /   const apikey = qcmzcorwbmrx8fezzg6qm09maypolahx;
  //   const source = 917834811114;
  //   const destination = 918421793467;
  //   const message = { type: 'text', text: 'hieeeeeeee' };

  //   res.redirect(
  //     `https://api.gupshup.io/sm/api/v1/msg?apikey=${apikey}&channel=whatsapp&source=${source}&destination=${destination}&message=${message}`
  //   );
});
