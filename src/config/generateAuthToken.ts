import JWT from 'jsonwebtoken';
import { secret } from './auth.json';

interface IProsps {
    id: string
}

const generateAuthToken = (id: IProsps["id"]) => {
    const token = JWT.sign({
        iss: 'StorGerenateTokenParaEsseApp',
        id
    }, secret, { expiresIn: '1d' });

    return token
}

export default generateAuthToken;