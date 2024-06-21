import { createHmac } from 'crypto';

const Hasher = {
    HASHER_KEY: "HASHER_KEY",
    HASHER_SALT: "HASHER_SALT",
    key: process.env["HASHER_KEY"] || '',
    salt: process.env["HASHER_SALT"] || '',

    hashString: function (data: string): string {
        if (!data) throw new Error("Data parameter was null or empty");

        const keyByte: Buffer = Buffer.from(this.key, 'utf-8');
        const messageBytes: Buffer = Buffer.from(data + this.salt, 'utf-8');
        const hmacsha384 = createHmac('sha384', keyByte);
        const hashmessage = hmacsha384.update(messageBytes).digest('base64');

        return hashmessage;
    },

    verify: function (data: string, hashedData: string): boolean {
        return hashedData === this.hashString(data);
    }
};

export default Hasher;