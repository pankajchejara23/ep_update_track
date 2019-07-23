ep_update_track
=======

An etherpad-lite plugin to track updates in pads and store them in CSV format for further processing. This plugin utilizes [server hooks](https://github.com/ether/etherpad-lite/wiki/Plugin-API-Hooks) (handleMessage) and record whenever a update event is detected.

# Installing
    npm install PATH/TO/THIS/FOLDER (from your etherpad-lite folder)


# CSV format
Tracks are stored in csv format. A snapshot of recorded data is provided in the below image


![Snapsho](snapshot.png)




The order of attributes are timestamp,client-ip,action-type,old-lenght,new-length, changeset,character-bank,no-of-add-event,no-of-remove-event.
* **Timestamp:** Timestamp of update event
* **client-ip:** IP address of the client who is updating the pad
* **action-type:** Currently, it only stores UPDATE event.
* **old-lenght:** This is the length of text in the pad before the update event.
* **new-length:** This is the length of text after updating it. For instance, if a user updated the pad and remove 2 characters then new lenght will be old-length - 2.
* **changeset:** It is the way in which Etherpad keeps the track of updates. It contains information regarding what operation has been performed and where in the text. For more information, please visit this [link](https://github.com/ether/etherpad-lite/wiki/Changeset-Library).
* **character-bank:** In case of add event (when client write some thing), it contains the new characters addedd to the text. In the case of remove event (when client delete something), it contains empty string.
* **no-of-add-event:** It represents the number of add event ("+") found in the changeset.
* **no-of-remove-event:** It represent the number of remover event ("-") found in the changeset.




# File location
The csv file gets stored in the etherpad root directory with the name 'data.csv'. Currently, this is for testing purpose. It only offers support to one pad sharing in the group.
