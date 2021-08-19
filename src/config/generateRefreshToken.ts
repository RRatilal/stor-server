import JWT from 'jsonwebtoken';
import { refreshSecret } from './auth.json';

interface IProsps {
    id: string
}

const generateRefreshToken = (id: IProsps["id"]) => {
    const refreshToken = JWT.sign({
        iss: 'StorGerenateRefreshTokenParaEsseApp',
        id
    }, refreshSecret, { expiresIn: "1m" });

    return refreshToken;
}

export default generateRefreshToken;