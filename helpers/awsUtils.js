const { SSOClient, GetRoleCredentialsCommand } = require("@aws-sdk/client-sso");

const fs = require("fs");
const path = require("path");
const {
  listFilesInDirectory,
  readConfigFile,
  writeConfigFile,
} = require("./fileUtils");
const awsConfigFilePath = path.resolve(require("os").homedir(), ".aws/config");
const awsCredentialFilePath = path.resolve(
  require("os").homedir(),
  ".aws/credentials"
);
const awsSSOCacheDirectory = path.resolve(
  require("os").homedir(),
  ".aws/sso/cache"
);
const AWS_DEFAULT_REGION = "eu-west-1";

const syncSSOCredentialsForProfile = async (profileName) => {
  const awsProfile = getAwsProfile(profileName);
  const cacheLogin = getSsoCachedLogin(awsProfile);
  if (!cacheLogin || !cacheLogin.accessToken) {
    throw new Error(
      "No valid cached SSO login found. Ensure you have logged in using AWS SSO."
    );
  }
  const credentials = await getSSORoleCredentials(awsProfile, cacheLogin);
  updateAwsCredentials(profileName, awsProfile, credentials);
};

const getSsoCachedLogin = (awsProfile) => {
  const filePaths = listFilesInDirectory(awsSSOCacheDirectory);
  const timeNow = new Date();

  for (const filePath of filePaths) {
    const data = JSON.parse(fs.readFileSync(filePath));
    if (
      data &&
      data.startUrl === awsProfile.sso_start_url &&
      data.region === awsProfile.sso_region &&
      timeNow <= new Date(data.expiresAt.substring(0, 19))
    ) {
      return data;
    }
  }
};

const getSSORoleCredentials = async (awsProfile, cacheLogin) => {
  const client = new SSOClient({ region: awsProfile.sso_region });
  const command = new GetRoleCredentialsCommand({
    roleName: awsProfile.sso_role_name,
    accountId: awsProfile.sso_account_id,
    accessToken: cacheLogin.accessToken,
  });

  const response = await client.send(command);
  return response.roleCredentials;
};

const getAwsProfile = (profileName) => {
  const configContent = readConfigFile(awsConfigFilePath);
  const profileData = configContent[`profile ${profileName}`];
  if (!profileData) {
    throw new Error(
      `Cannot find profile ${profileName} definition in ${awsConfigFilePath}`
    );
  }
  return profileData;
};

const updateAwsCredentials = (profileName, awsProfile, credentials) => {
  const region = awsProfile.region || AWS_DEFAULT_REGION;
  if (!fs.existsSync(awsCredentialFilePath)) {
    fs.writeFileSync(awsCredentialFilePath, "");
  }

  let configContent = readConfigFile(awsCredentialFilePath);
  configContent[profileName] = {
    region,
    aws_access_key_id: credentials.accessKeyId,
    aws_secret_access_key: credentials.secretAccessKey,
    aws_session_token: credentials.sessionToken,
  };
  writeConfigFile(awsCredentialFilePath, configContent);
};

module.exports = {
  syncSSOCredentialsForProfile,
};
