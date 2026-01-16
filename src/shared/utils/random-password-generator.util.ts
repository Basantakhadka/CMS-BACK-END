/**
 * Generates a random password of the specified length.
 * @param {number} length - The length of the password to generate.
 * @returns {string} A randomly generated password.
 */
export function randomPasswordGeneratorUtil(length:number){
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        return password;
}