
// Middleware global para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.httpStatusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Error interno del servidor',
            details: err.details || null
        }
    });
};

export default errorHandler;