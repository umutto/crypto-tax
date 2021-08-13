import aws from "aws-sdk";

const client = new aws.DynamoDB.DocumentClient({
  accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
  region: process.env.DYNAMODB_REGION,
  params: {
    tableName: process.env.DYNAMODB_TABLE,
  },
});

export default {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
};
