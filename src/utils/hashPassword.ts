import bcrypt from 'bcrypt';

export default async function hashPassword(password: string) {
    const passwordHashed = await bcrypt.hash(password, 10);

    return passwordHashed;
}