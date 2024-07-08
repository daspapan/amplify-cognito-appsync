import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from '../cdk.context';
import { createAuth } from './auth/cognito';
import { createTodoTable } from './tables/dynamodb';
import { createAppSyncAPI } from './api/appsync';
import { createAmplifyHosting } from './hosting/amplify';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps, context: CDKContext) {
    super(scope, id, props);

    const appNameWithStage = `${context.appName}-${context.stage}`;

    // Cognito Setup
    const auth = createAuth(this, {appName: appNameWithStage});

    // DynamoDB Setup
    const todoTable = createTodoTable(this, {appName: appNameWithStage});

    // AppSync Setup
    const api = createAppSyncAPI(this, {
      appName: appNameWithStage,
      userPool: auth.userPool,
      authRole: auth.identityPool.authenticatedRole,
      unauthRole: auth.identityPool.unauthenticatedRole,
      identityPoolId: auth.identityPool.identityPoolId,
      todoTable,
    })

    // Amplify Hosting
    /* const amplifyHosting = createAmplifyHosting(this, {
      appName: appNameWithStage,
      account: context.env.account,
      branch: context.branch,
      ghOwner: context.hosting.ghOwner,
      ghTokenName: context.hosting.ghTokenName,
      repo: context.hosting.repo,
      environmentVariables: {
        userPoolId: auth.userPool.userPoolId,
        userPoolClientId: auth.userPoolClient.userPoolClientId,
        identityPool: auth.identityPool.identityPoolId,
        region: this.region,
        apiUrl: api.graphqlUrl,
      }
    }) */

    new cdk.CfnOutput(this, 'GraphQLApiUrl', {value: api.graphqlUrl})
    new cdk.CfnOutput(this, 'GraphQLApiId', {value: api.apiId})
    new cdk.CfnOutput(this, 'UserPoolId', {value: auth.userPool.userPoolId})
    new cdk.CfnOutput(this, 'UserPoolClientId', {value: auth.userPoolClient.userPoolClientId})
    new cdk.CfnOutput(this, 'IdentityPoolId', {value: auth.identityPool.identityPoolId})
    new cdk.CfnOutput(this, 'Region', {value: this.region})
    // new cdk.CfnOutput(this, 'AmplifyAppId', {value: amplifyHosting.appId})

  }
}
