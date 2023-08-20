# cdk-sso-profile
A tool to synchronise AWS SSO profiles with AWS CDK CLI

## Description

`cdk-sso-profile` is a simple Node.js tool that helps connect your AWS CDK commands with AWS SSO profiles. With it, setting up and using AWS SSO with your CDK commands becomes easy and hassle-free.

## Prerequisites

- Node.js (version 14 or higher)
- AWS CLI configured with SSO

## Installation

To use `cdk-sso-profile`, you can clone the repository and install its dependencies:

```bash
git clone [repository-url]
cd cdk-sso-profile
npm install
npm link
```

## Usage

First ensure you have logged in with AWS SSO by running:

```bash
aws sso login --profile [your-profile-name]
```

Then, you can execute `cdk-sso-profile` followed by your AWS profile name:

```bash
cdk-sso-profile [your-profile-name]
```

Example:

```bash
aws sso login --profile dev
cdk-sso-profile dev
```

Upon successful execution, the script will synchronize your AWS CDK CLI with the specified SSO profile, allowing you to run CDK commands with the `--profile` option.

## Contributing

If you'd like to contribute to the development of `cdk-sso-profile`, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---