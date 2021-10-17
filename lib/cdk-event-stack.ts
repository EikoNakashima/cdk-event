import * as cdk from '@aws-cdk/core';
// import {RemovalPolicy} from '@aws-cdk/core';
// import {NodejsFunction} from "@aws-cdk/aws-lambda-nodejs";
// import {Table, BillingMode, AttributeType} from '@aws-cdk/aws-dynamodb';
// import * as events from "@aws-cdk/aws-events";
// import * as targets from '@aws-cdk/aws-events-targets';
import EventBridge = require('@aws-cdk/aws-events');


export class CdkEventStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  //   const batchSampleTable = new Table(this, "batchSampleTable", {
  //     billingMode: BillingMode.PAY_PER_REQUEST,
  //     partitionKey: {
  //         name: "sample_id",
  //         type: AttributeType.NUMBER,
  //     },
  //     removalPolicy: RemovalPolicy.DESTROY
  // });

  // // 定期実行する Lambda 関数
  // const sampleLambda = new NodejsFunction(this, "sampleLambda", {
  //     entry: "src/index.ts",
  //     handler: "handler",
  //     environment: {
  //         TABLE_NAME: batchSampleTable.tableName
  //     }
  // });
  // batchSampleTable.grantReadWriteData(sampleLambda);

  // // EventBridge のルール
  // new events.Rule(this, "sampleRule", {
  //     // JST で毎月1日の AM1:00 に定期実行
  //     // see https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions
  //     schedule: events.Schedule.cron({minute: "0", hour: "16", day: "L"}),
  //     targets: [new targets.LambdaFunction(sampleLambda, {retryAttempts: 3})],
  // });

  const bus = new EventBridge.CfnEventBus(this, 'bus-from-cdk', {
    name: 'fromCDK'
  })
  const rule = new EventBridge.CfnRule(this, 'rule-from-cdk', {
    name: 'FromCDKRule',
    description: 'trial',
    eventBusName: bus.attrName,
    eventPattern: {
      "detail-type": [
        "customer.created",
        "customer.updated"
      ],
      "source": [
        "Stripe"
      ]
    },
    state: "ENABLED",
    targets: [
      {
        id: "aaaaaa", 
        arn: "arn:aws:lambda:us-east-1:99999:function:first-function"
      }, 
      {
        id: "bbbbbb", 
        arn: "arn:aws:lambda:us-east-1:99999:function:second-function"
      }
  ]
  })
  rule.addDependsOn(bus)
 }
}
