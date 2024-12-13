// utils/uploadUtils.ts

import { uploadData } from '@aws-amplify/storage';
import { ENDPOINT } from '../services/API/endpoints';

export const AWS_s3_UPLOAD = async (file: any, pathPrefix: string = 'public/flexxydrive/album') => {
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const filePath = `${pathPrefix}/${timestamp}_${file.filename}`;

	try {
		const result = await uploadData({
			path: filePath,
			data: file,
			options: {},
		}).result;

		const fileUrl = ENDPOINT.AWS_BASEURL_S3 + result.path;
		console.log('Succeeded URL: ------>', fileUrl);
		return fileUrl;
	} catch (error) {
		console.error('Error uploading file to S3: ', error);
		throw new Error('File upload failed');
	}
};
