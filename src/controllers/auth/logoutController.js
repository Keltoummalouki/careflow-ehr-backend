import jwt from 'jsonwebtoken'
import BlacklistedToken from '../../models/BlacklistedToken.js'
import { validateLogout } from '../../validators/auth/logoutValidator.js'


export async function logout(req, res) {
    try {
        const { error, value } = validateLogout(req.body);

        if(error) {
            return res.status(400).json({
                message: 'Invalid data',
                details: error.details.map(d => d.message)
            });
        }

        const {refreshToken} = value;
        
        let decoded;

        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(200).json({message: 'Logged out'});
        }

        const expMs = decoded?.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;

        await BlacklistedToken.updateOne(
            {token: refreshToken},
            {token: refreshToken, expiresAt: new Date(expMs)},
            {upsert: true} // When true, creates a new document if no document matches the query
        );

        return res.status(200).json({message: 'Logged out'});

    } catch (err) {
        return res.status(500).json({message: 'Server error', error: err.message});
    }
}