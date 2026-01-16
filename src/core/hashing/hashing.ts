import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";

function deriveSalt(userIdentifier: string, userName:string) {
	var hmac = crypto.createHmac('sha512', userIdentifier);
	//passing the data to be hashed
	const data = hmac.update(userName);
	//Creating the hmac in the required format
	return data.digest('hex');
}

export async function hashPassword(password: string, userIdentifier: string, userName:string) {
	const salt = deriveSalt(userIdentifier, userName);
	const saltedPassword = password + salt;
	return bcrypt.hash(saltedPassword, 12);
}

export async function comparePassword(
	password: string,
	hashedPassword: string,
	userIdentifier: string,
	userName: string
  ) {
	const salt = deriveSalt(userIdentifier, userName);
	const saltedPassword = password + salt;
	try {
	  return await bcrypt.compare(saltedPassword, hashedPassword);
	} catch (e) {
	  return false;
	}
  }

/**
 * Generates a hash for the merchant portal based on the provided password and login ID.
 * @param {string} password - The password to be hashed.
 * @param {string} loginId - The optional login ID to be included in the hashing process.
 * @returns {string} The generated hash.
 */
export function generateMerchantPortalhash(password: string, loginId: string){
	const firstHash = crypto
		.createHash('sha256')
		.update(password, 'utf8')
		.digest('hex');

	let finalHash = firstHash;


	if (loginId !== null) {
		finalHash = crypto
			.createHash('sha256')
			.update(firstHash + loginId, 'utf8')
			.digest('hex');
	}

	return finalHash;
}


