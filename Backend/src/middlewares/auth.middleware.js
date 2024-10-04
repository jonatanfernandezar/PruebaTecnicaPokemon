import jwt from 'jsonwebtoken';
import { pool } from '../databases/db.mysql.js';

// Middleware para verificar el token JWT y autenticar al usuario
export const verifyToken = (req, res, next) => {
    console.log('La cabezera es: ', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    console.log('El Token recibido es:', token);

    if (!token) {
        console.log('El Token is false, no ha sido proporcionado');
        return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, 'tu_clave_secreta_aqui', async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        console.log(decoded);

        try {
            const [user] = await pool.query('SELECT id FROM users_pokemon WHERE id = ?', [decoded.id]);
            if (user.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            req.user = { id: decoded.id };
            console.log('Usuario autenticado:', req.user);
            next();
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar el usuario.', error: error.message });
        }
    });
};

// Middleware para verificar si el usuario actual es Admin
export function verifyAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso denegado, Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, 'tu_clave_secreta_aqui');
        req.user = decoded;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};

// Middleware para verificar si el usuario actual es super admin
export const verifySuperAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso denegado, Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, 'tu_clave_secreta_aqui');
        req.user = decoded;
        // Verificar si el usuario es super admin
        const [user] = await pool.query('SELECT * FROM users WHERE id = ? AND is_super_admin = 1', [req.user.id]);
        if (user.length === 0) {
            return res.status(403).json({ message: 'Acceso denegado. Solo el super admin puede realizar esta acción.' });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};


