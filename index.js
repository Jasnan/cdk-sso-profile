#!/usr/bin/env node
const { syncSSOCredentialsForProfile } = require("./helpers/awsUtils");
const packageInfo = require("./package.json");

const main = async () => {
  console.log(`Executing cdk-sso-profile, version ${packageInfo.version}.`);

  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error(
      "Please specify your AWS profile name. For example: cdk-sso-profile my-profile-name."
    );
    process.exit(1);
  }

  const profileName = args[0];
  try {
    await syncSSOCredentialsForProfile(profileName);
    console.log(
      `Configuration complete! You can now use CDK with the profile option: --profile ${profileName}.`
    );
  } catch (error) {
    console.error(
      `Error while syncing SSO credentials: ${error.message}. Make sure you've logged in with AWS SSO using: 'aws sso login --profile ${profileName}'.`
    );
    process.exit(1);
  }
};

main();
