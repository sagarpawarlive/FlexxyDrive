const awsconfig = {
  Auth: {
    identityPoolId: 'eu-central-1:a939c29d-a688-47bf-95de-fd7b94202312',
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_FanxnLxzC',
    userPoolWebClientId: '3v89psjimngbqi3cbcp8gdav9h',
  },
  Storage: {
    AWSS3: {
      bucket: 'flexxydriveweb5bdce-dev',
      region: 'eu-central-1',
      identityPoolId: 'eu-central-1:a939c29d-a688-47bf-95de-fd7b94202312'
    },
  },
};

export default awsconfig;
