const PubNub = require("pubnub");
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: "pub-c-ee8d5114-572e-40bd-bb92-6b00b09fc202",
  subscribeKey: "sub-c-6c7df15a-c787-11ec-8c08-82b465a2b170",
  //uuid: uuid,
  restore: true,
  presenceTimeout: 20,
  autoNetworkDetection : true,
  userId: uuid,
  //keepAlive : true,
});

module.exports = { pubnub };
