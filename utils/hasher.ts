import { createHmac } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const Hasher = {
    HASHER_KEY: process.env.HASHER_KEY || "HASHER_KEY",
    HASHER_SALT: process.env.HASHER_SALT || "HASHER_SALT",

    hashString: function (data: string): string {
        if (!data) throw new Error("Data parameter was null or empty");

        // log out key and salt
        console.log(this.HASHER_KEY);
        console.log(this.HASHER_SALT);

        const keyByte: Buffer = Buffer.from(this.HASHER_KEY, 'utf-8');
        const messageBytes: Buffer = Buffer.from(data + this.HASHER_SALT, 'utf-8');
        const hmacsha384 = createHmac('sha384', keyByte);
        const hashmessage = hmacsha384.update(messageBytes).digest('base64');

        return hashmessage;
    },

    verify: function (data: string, hashedData: string): boolean {
        return hashedData === this.hashString(data);
    }
};

export default Hasher;