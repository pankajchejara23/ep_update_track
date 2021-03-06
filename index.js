/*
This plugin record every updates made by users on pad.
These records then saved in csv format for further processing.
Developer: Pankaj Chejara
*/



// import filesytem package
var fs = require('fs');

// import changeset library from ehterpad to process changeset (it is a string containing information of updates)
var Changeset = require("ep_etherpad-lite/static/js/Changeset");



// This function gets called whenever server received a message from client user
// For instance, when client join a pad, update text in pad, leave the pad
exports.handleMessage = function(hook, context,callback){



  // Fetching data from the context parameter
  msg = context.message.data;
  //console.log(context);
  // building current time stamp
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  //ts = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;


  // prints date & time in YYYY-MM-DD HH:MM:SS format
  ts = hours + ":" + minutes + ":" + seconds + " " + date + "-" + month + "-" + year;

  // adding timestamp to the entry to save in file
  data = ts;

  // this flag used to process only USER_CHANGES type messages
  flag= false;

  // Add client id to the entry
//  data = data + "," + context.client.client.id;
  data  =  data + "," + context.client.conn.remoteAddress;

  //console.log(data);
  // creating a temporary variable with message data
  myobject = msg;

  // For storing changeset of operations
  subops = "";

  // For storing number of characters added
  plus = 0;

  // For storing number of characters deleted
  minus = 0;

  file_flag = true;

  if (Boolean(context.message.padId) && file_flag){
    logfile = context.message.padId+".csv";
    // console.log(logfile);
    file_flag = false;
  }



  // Iterate over all keys in msg data (data stored in json format)
  for(var attributename in myobject){

    //console.log(attributename);


    // If attributename is type and it is USER_CHANGES then add update entry and set flag true

    if (attributename == "type"){


      // Check whether user changed his name or not
      if(myobject[attributename]=='USERINFO_UPDATE')

      {

         ip_entry = "";
         //console.log('USERINFO_UPDATE called');
         ip_entry = myobject['userInfo']['ip']+","+myobject['userInfo']['name']+"\n";
         // Create a new file with IP to Name mapping
         fs.appendFileSync("ip_mapping.csv", ip_entry, (err) => {
           if (err) console.log("File can't be saved"+err);
           //console.log("IP mapping written to File.");

         });


      }

      if (myobject[attributename]=="USER_CHANGES") {
        flag=true;
         data = data +',UPDATE';
       }
     }
     // console.log(myobject);
    // If attributename is changeset and it is with USER_CHANGES type
    if ((attributename == 'changeset') && (flag == true)){

      cs = myobject[attributename];

      // Unpack the changeset using Changeset library
      unpacked = Changeset.unpack(myobject[attributename]);
      // console.log(unpacked);

      // Add old lenght, new length, operations, character bank to the entry
      data = data + ","+ unpacked.oldLen + "," + unpacked.newLen + "," + unpacked.ops + ",'" + (unpacked.charBank).trim()+"'";

      //console.log(data);

      // Iterator over the operations extracted from changeset
      var opiterator = Changeset.opIterator(unpacked.ops);

      // hasNext() return true if it has a operator otherwise false

      while (opiterator.hasNext()){
        subop = opiterator.next();
        if ( subop.opcode == "+" ) {
           plus = plus + 1;
         }
         if ( subop.opcode == "-" ) {
            minus = minus + 1
          }
        //console.log(opiterator.next());
        // next() function gets the current operation and move to next
        //operations = operations + JSON.stringify(subop) + ":";

        //if opiterator.hasNext() {
        //  operations = operations + ":";
        //}

      }
    }
  }
  //console.log("IP:"+context.client.conn.remoteAddress);
  //console.log(context);
  data = data + "," + plus + "," + minus +  "\n";
  plus = 0;
  minus = 0;
  //console.log(data);

  // if flag is true then only write entry into the file
  if (flag == true){
    // save data in data.csv

    fs.appendFileSync("log_data.csv", data, (err) => {
      if (err) console.log("File can't be saved"+err);
      console.log("Successfully Written to File.");

    });
  flag=false;
  }


  // This function will handle the coming message further (taken care by etherpad)
  callback();
  }
