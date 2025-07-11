import * as crypto from 'crypto';

/**
 * Encrypt a file using MD5 to get a hash which is a fingerprint for the file
 * @param buffer - The file buffer
 * @returns The encrypted file
 */
export function encryptFileMD5(buffer: Buffer) {
	const md5 = crypto.createHash('md5');

	return md5.update(buffer).digest('hex');
}
