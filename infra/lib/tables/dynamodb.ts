import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Billing, BillingMode, Table, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs"

type TodoTableProps = {
    appName: string
}

export function createTodoTable(scope: Construct, props: TodoTableProps){

    const tableName = `${props.appName}-TodoTable`;

    const table = new Table(scope, tableName, {
        partitionKey: {name: 'id', type: AttributeType.STRING},
        tableName,
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST
    })

    table.addGlobalSecondaryIndex({
        indexName: 'todoByOwner',
        partitionKey: {
            name: '__typename', type: AttributeType.STRING
        },
        sortKey: {name: 'owner', type: AttributeType.STRING}
    })

    return table
}