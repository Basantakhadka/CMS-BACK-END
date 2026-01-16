import axios from "axios";
import * as https from 'https';
export const decodeBase64 = (base64String: string) => {
    return Buffer.from(base64String, 'base64').toString('utf-8')
}

export const encodeBase64 = (body: string | object) => {
    return Buffer.from(JSON.stringify(body)).toString('base64')
}

export async function imageUrlToBase64(imageUrl: string): Promise<string | null> {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer',httpsAgent: agent  });
        const base64Data = Buffer.from(response.data).toString('base64');
        return base64Data;
    } catch (error) {
        console.log("Base64 Error:", error)
        return null;
    }
}
