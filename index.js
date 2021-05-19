const { parseRawData, actionDataToAog } = require("./helper/aogDataParser");

let dataFromAog = {};
const aogActionToCall = [];
const sendActionToAoGClient = (fn) => (aogActionToCall[0] = fn);

/**
 * AoG Server - communication for AoG Client
 */
const net = require("net");
// create the server
let server = net.createServer((connection) => {
  console.log("new connection from AoG client");

  sendActionToAoGClient(() =>
    connection.write(
      JSON.stringify({
        actionName: actionDataToAog.actionName,
        messageType: actionDataToAog.messageType,
        data: actionDataToAog.data,
      })
    )
  );

  connection.on("data", (data) => {
    if (data == undefined || data == null) {
      return;
    }
    let parsedData = parseRawData(data.toString());
    dataFromAog = parsedData;

    //notification for web subs
    subscribers.forEach((fn) => fn());
    connection.write(JSON.stringify({ messageType: "RECEIVED_CONFIRMATION" }));

    return;
  });

  // When the client requests to end the TCP connection with the server, the server
  // ends the connection.
  connection.on("end", function () {
    console.log("Closing connection with the client");
  });

  // Don't forget to catch error, for your own sake.
  connection.on("error", function (err) {
    console.log(`Error: ${err}`);
  });
});

// look for a connection on port 50,000
server.listen(50000, () => {
  console.log("waiting for a AoG connection"); // prints on start
});

/**
 * graphql - for webClient
 */

const { GraphQLServer, PubSub } = require("graphql-yoga");
const { typeDefs } = require("./graphql/typeDefs");

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    dataFromAog: () => dataFromAog,
  },
  Mutation: {
    postDataFromAog: (parent, { dataFromAogInput }) => {
      const id = 1;
      console.log(dataFromAogInput);
      dataFromAog = dataFromAogInput;
      subscribers.forEach((fn) => fn());
      return id;
    },
    postCallAction: (parent, { actionName, actionParams, messageType }) => {
      const id = 1;
      console.log(actionName + " " + actionParams);
      actionDataToAog.actionName = actionName;
      actionDataToAog.messageType = messageType;
      actionDataToAog.data = actionParams;
      actionDataToAog.isChanged = true;
      actionDataToAog.isSended = false;
      console.log("actionDataToAog: " + JSON.stringify(actionDataToAog));
      aogActionToCall.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    dataFromAog: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { dataFromAog }));
        setTimeout(() => pubsub.publish(channel, { dataFromAog }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();

const serverWeb = new GraphQLServer({
  typeDefs,
  resolvers,
  context: { pubsub },
});
serverWeb.start(({ port }) => {
  console.log(`Server running on http://localhost:${port}/`);
});
