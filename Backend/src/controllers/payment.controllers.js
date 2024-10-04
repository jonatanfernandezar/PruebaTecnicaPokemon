import mercadopago from 'mercadopago';
import nodemailer from 'nodemailer';
import { MERCADOPAGO_API_KEY } from '../libs/configMercadoPago.js';
import https from 'https';
import { pool } from "../databases/db.mysql.js";
import { config } from "dotenv";
config();

mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
});

console.log('El token del Vendedor de Mercado Pago es: ', MERCADOPAGO_API_KEY)

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jonatanfernandezar@gmail.com',
        pass: 'aplm fuio xsoq tkxj'
    }
});

export const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No se enviaron ítems para procesar el pago' });
        }

        const result = await mercadopago.preferences.create({
            items: items.map(item => ({
                title: item.name,
                unit_price: item.price * 30,
                currency_id: "COP",
                quantity: item.quantity || 1,
                picture_url: item.image,
            })),
            back_urls: {
                success: 'http://localhost:4200/dashboard-user/payment-success',
            },
            auto_return: 'approved',
            notification_url: "https://1a01-186-1-185-15.ngrok-free.app/api/v1/payment/webhook",
        })
        const initPoint = result.body.init_point;

        res.status(200).json({
            message: 'Pago iniciado con éxito',
            redirect_url: initPoint
        });
    } catch (error) {
        console.error('Error creando la preferencia de pago:', error);
        res.status(500).json({ error: 'Hubo un error al crear la orden de pago' });
    }
}

export const confirmOrden = async (req, res) => {
    res.send({ message: 'El Producto fue comprado exitosamente' });
}

const enviarCorreoDeConfirmacion = async (notificationData) => {

    const paymentId = notificationData?.payer?.id;
    const payerEmail = notificationData?.payer?.email;
    const paymentStatus = notificationData?.status || 'sin información de estado';
    const transactionId = notificationData?.id || 'sin ID de transacción';

    const mailOptions = {
        from: 'jonatanfernandezar@gmail.com',
        to: payerEmail,
        subject: 'Confirmación de Pago - Mercado Pago',
        text: `Tu pago ha sido ${paymentStatus}. El ID de la transacción es: ${transactionId}.`
    };

    if (!payerEmail || !paymentId) {
        console.error('Faltan datos importantes en la notificación:', {
            payerEmail,
            paymentId
        });
        throw new Error('Faltan datos importantes en la notificación');
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de confirmación enviado a:', payerEmail);
    } catch (error) {
        console.error('Error al procesar la notificación:', error);
        throw error;
    }
};

export const receiveWebHook = async (req, res) => {
    try {
        const notificationData = req.body;
        console.log('Estos son los datos que recibe webHook: ', notificationData);
        console.log('El tipo de la transaccion es: ', notificationData.topic);

        if (!notificationData || !notificationData.topic) {
            return res.status(400).json({ message: 'Datos de notificación inválidos' });
        }

        if (notificationData.topic === 'payment') {
            //const paymentId = notificationData.data.id;
            const paymentId = notificationData.resource;
            console.log('El ID del pago es: ', paymentId);

            const paymentDetails = await obtenerDetallePago(paymentId);
            console.log('Los detalles del pago son: ', paymentDetails);

            const paymentIdDetails = paymentDetails?.id;
            const payerId = paymentDetails.payer?.id;
            const payerEmail = paymentDetails.payer?.email;
            const status = paymentDetails?.status;
            const amount = paymentDetails?.transaction_amount;
            const currency = paymentDetails?.currency_id;

            if (!paymentIdDetails || !payerId || !payerEmail || !status || !amount || !currency) {
                console.error('Faltan datos requeridos para almacenar la compra.');
                return res.status(400).json({ error: 'Datos incompletos para almacenar la compra' });
            }
            console.log('Los valores que se van a almacenar en la BD son: ', paymentIdDetails, payerId, payerEmail, status, amount, currency);
            
            const query = `INSERT INTO compras (payment_id, payer_id, payer_email, status, amount, currency) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [paymentId, payerId, payerEmail, status, amount, currency];
            
            await pool.query(query, values);

            if (paymentDetails.status === 'approved') {
                await enviarCorreoDeConfirmacion(paymentDetails);
            }

            const querySelect = `SELECT * FROM compras WHERE payment_id = ?`;
            const [result] = await pool.query(querySelect, [paymentIdDetails]);
            console.log('Datos de la compra guardada: ', result);
            return res.status(200).json({
                message: 'Compra procesada y guardada correctamente',
                compra: result
            });
        }
        return res.status(200).json({ message: 'Notificación no relacionada con un pago' });
    } catch (error) {
        console.error('Error al procesar la notificación:', error);
        res.status(500).json({ error: 'Hubo un error al procesar la notificación' });
    }
};

async function obtenerDetallePago(paymentId) {
    const options = {
        hostname: 'api.mercadopago.com',
        path: `/v1/payments/${paymentId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${MERCADOPAGO_API_KEY}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });

        req.on('error', (error) => {
            console.error('Error al obtener detalles del pago:', error);
            reject(error);
        });

        req.end();
    });
}