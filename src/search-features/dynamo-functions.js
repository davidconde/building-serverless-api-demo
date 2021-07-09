const AWS = require("aws-sdk");

const getDynamoClient = () => {
  return new AWS.DynamoDB.DocumentClient({ region: "eu-west-1" });
};

const getSingleObjectWithPartitionKey = async (pk, sk) => {
  let expression = "primary_key = :pk";
  let maps = {
    ":pk": pk
  };

  if (sk) {
    expression = "primary_key = :pk and begins_with(sort_key, :sk)"
    maps[":sk"] = sk;
  }

  const query = {
    TableName: process.env.DYNAMO_TABLE,
    KeyConditionExpression: expression,
    ExpressionAttributeValues: maps,
    ScanIndexForward: false
  };

  const client = getDynamoClient();
  return client.query(query).promise();
}

module.exports = getSingleObjectWithPartitionKey;