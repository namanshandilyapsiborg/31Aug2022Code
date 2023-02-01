const PubNub = require("pubnub");
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: "pub-c-90d5fa5c-df63-46c7-b5f2-2d6ad4efd775",
  subscribeKey: "sub-c-81c16c55-f391-4f72-8e57-2d9e052a360c",

  // publishKey: "pub-c-1a0b4b54-d0f4-4493-86d8-fc2d56a06f55",
  // subscribeKey: "sub-c-3df591b2-a923-460c-8078-2ab79fea5016",
  //uuid: uuid,
  restore: true,
  // presenceTimeout: 20,
  autoNetworkDetection : true,
  userId: uuid,
  //keepAlive : true,
});

module.exports = { pubnub };
