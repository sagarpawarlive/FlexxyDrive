// utils/uploadUtils.ts

import { uploadData } from '@aws-amplify/storage';
import { ENDPOINT } from '../services/API/endpoints';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import ImagePicker from 'react-native-image-crop-picker';

export const s3Upload = async (file: any, pathPrefix: string | null = 'public/flexxydrive/album') => {
	const timestamp = Math.floor(new Date().getTime() / 1000);
	let filePath = `${pathPrefix}/${timestamp}_${file.filename?.toLowerCase()}`;

	let processedFile = file;

	if (file.filename?.toLowerCase().endsWith('.heic')) {
		processedFile = {
			...file,
			sourceURL: file.path, // Update to converted file path
			filename: `${timestamp}.jpg`, // Update filename with new extension
		};
	}

	const fileContent = await RNFS.readFile(processedFile.sourceURL, 'base64'); // Read as base64
	const cleanBase64 = fileContent.replace(/^data:image\/\w+;base64,/, '');
	const base64Data = Buffer.from(cleanBase64, 'base64');

	try {
		const result = await uploadData({
			path: filePath,
			data: base64Data,
			options: {
				contentType: 'image/jpeg', // Use JPEG as default content type
				contentEncoding: 'base64',
				onProgress: progress => {
					const { transferredBytes, totalBytes } = progress;
				},
			},
		}).result;

		const fileUrl = ENDPOINT.AWS_BASEURL_S3 + result.path;
		console.log('Succeeded URL: ------>', fileUrl);
		return fileUrl;
	} catch (error) {
		console.error('Error uploading file to S3: ', error);
		throw new Error('File upload failed');
	}
};
