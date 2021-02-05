const { timeStamp } = require('console');

const data = {
  chatbot: {
    phoneNo: {
      phone: 23423424,
      pincode: 234234,
      name: 'Shriyash',
      address: 'werwfaljdf',
      areaCode: 2,
      history: {
        Datetime: {  
          Messages: {
            timeStamp: 'msg',
            timeStamp: 'msg',
            timeStamp: 'msg',
            timeStamp: 'msg',
          },
          product: '1 0.5kg',
          count: 6,
          cut: 'anystring',
        },
        Datetime: {
          Messages: {
            timeStamp: 'msg',
            timeStamp: 'msg',
            timeStamp: 'msg',
            timeStamp: 'msg',
          },
          product: '1 0.5kg',
          count: 2,
          cut: 'anystring',
        },
      },
    },
  },
};

// 30min limit
// after finishing chat  => enter 1 row in orders table
// if user doesnt reply wait for 30 min and then start convo again
// image url 
// database restructuring 
// datetime feature 
// putting data in excel sheet
//  conditions on date time 

// iteration in google sheets where to stop 

// validate pincode capture the areas and show the menu 