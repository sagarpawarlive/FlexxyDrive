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
			identityPoolId: 'eu-central-1:a939c29d-a688-47bf-95de-fd7b94202312',
			// chunkSize: 100 * 1024 * 1024, // Set chunk size to 5MB (default is 5MB, can be increased)
			// partSize: 100 * 1024 * 1024, // Set part size (usually same as chunkSize)
			// timeout: 600000, // Set timeout to 10 minutes
			// retries: 3, // Set retry count for failed uploads
		},
	},
};

export default awsconfig;
