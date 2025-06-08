import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib/core';
import { AmplifyCustomResources } from '@aws-amplify/backend';

export function configure(stack: Stack, amplify: AmplifyCustomResources) {
  // Find the role Amplify created for server-side rendering
  const ssrRole = stack.node.findChild('AmplifySSRLoggingRole') as Role;

  if (ssrRole) {
    // Add the required SSM parameter read permissions to the role
    ssrRole.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['ssm:GetParameter'],
        resources: [`arn:aws:ssm:${stack.region}:${stack.account}:parameter/cdk-bootstrap/*`],
      })
    );
  }
}
