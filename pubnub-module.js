const PubNub = require("pubnub");
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: "pub-c-c2134929-3d1b-41e8-b203-ef55d7888168",
  subscribeKey: "sub-c-afb1681f-fda5-4a6a-b81f-7a701185e7ad",
  //uuid: uuid,
  restore: true,
  presenceTimeout: 20,
  autoNetworkDetection : true,
  userId: uuid,
  //keepAlive : true,
});

module.exports = { pubnub };
