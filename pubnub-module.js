const PubNub = require("pubnub");
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: "pub-c-90d5fa5c-df63-46c7-b5f2-2d6ad4efd775",
  subscribeKey: "sub-c-81c16c55-f391-4f72-8e57-2d9e052a360c",
  //uuid: uuid,
  restore: true,
  // presenceTimeout: 20,
  autoNetworkDetection : true,
  userId: uuid,
  //keepAlive : true,
});

module.exports = { pubnub };
