# Migrate mongodb to dynamodb
The following config parameters are supported, they are defined in `config/default.js` and can be configured in env variables:


| Name                                   | Description                                | Default                          |
| :------------------------------------- | :----------------------------------------: | :------------------------------: |
| LOG_LEVEL                              | The log level                              |  info                            |
| MONGODB_URL                            | The MongoDB URL.  This needs to be the same MongoDB used by topcoder-x-receiver, topcoder-x-processor, and topcoder-x-site                           | mongodb://127.0.0.1:27017/topcoderx |
|COLLECTION_COUNTS | The counts of testing data for each model| |
|AWS_ACCESS_KEY_ID | The Amazon certificate key to use when connecting. Use local dynamodb you can set fake value |FAKE_ACCESS_KEY_ID |
|AWS_SECRET_ACCESS_KEY | The Amazon certificate access key to use when connecting. Use local dynamodb you can set fake value |FAKE_SECRET_ACCESS_KEY |
|AWS_REGION | The Amazon certificate region to use when connecting. Use local dynamodb you can set fake value |FAKE_REGION |
|IS_LOCAL | Use Amazon DynamoDB Local or server | 'true' |

## Scripts
Create testing data to mongodb, this command will generate bulk fake data to testing migration.
You also can create regular data by opcoder-x-receiver/topcoder-x-processor/topcoder-x-site
```
npm run create-test-data
```

migrate mongodb data to dynamodb
```
npm run migrate-data
```
