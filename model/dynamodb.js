import aws from "aws-sdk";

/**
 * Example Table structure
 * PrimaryKey: from#to (btc#jpy)
 * SortKey: registerDateEpoch#transactionDateEpoch (1488888888#1288888888)
 * SentAmount: int (15.22)
 * ReceivedAmount: int (63261.36)
 * FeeAmount: int (0.0)
 * FeeCurrency?: string (JPY)
 * Label?: string (airdrop)
 * Description?: string (cid_0000000)
 * TxHash?: string (AEGBABAEBEAHGAHE)
 * Wallet?: string (coincheck)
 */

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
