const pool = require('../config/db');

// Obtener todas las tarjetas
const obtenerTarjetas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                numero_tarjeta,
                nombre_usuario,
                dpi_usuario,
                telefono,
                correo,
                saldo,
                estado,
                fecha_registro,
                TO_CHAR(fecha_registro, 'YYYY-MM-DD') AS fecha_registro_formato
            FROM tarjetas
            ORDER BY id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tarjetas:', error);
        res.status(500).json({ mensaje: 'Error al obtener tarjetas' });
    }
};

// Obtener tarjeta por ID
const obtenerTarjetaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                id,
                numero_tarjeta,
                nombre_usuario,
                dpi_usuario,
                telefono,
                correo,
                saldo,
                estado,
                fecha_registro,
                TO_CHAR(fecha_registro, 'YYYY-MM-DD') AS fecha_registro_formato
            FROM tarjetas
            WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Tarjeta no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener tarjeta:', error);
        res.status(500).json({ mensaje: 'Error al obtener tarjeta' });
    }
};

// Crear tarjeta
const crearTarjeta = async (req, res) => {
    const {
        numero_tarjeta,
        nombre_usuario,
        dpi_usuario,
        telefono,
        correo,
        saldo,
        estado,
        fecha_registro
    } = req.body;

    try {
        if (!numero_tarjeta || !nombre_usuario) {
            return res.status(400).json({
                mensaje: 'El número de tarjeta y el nombre del usuario son obligatorios'
            });
        }

        const result = await pool.query(`
            INSERT INTO tarjetas (
                numero_tarjeta,
                nombre_usuario,
                dpi_usuario,
                telefono,
                correo,
                saldo,
                estado,
                fecha_registro
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, CURRENT_DATE))
            RETURNING *
        `, [
            numero_tarjeta,
            nombre_usuario,
            dpi_usuario,
            telefono,
            correo,
            saldo || 0,
            estado || 'Activa',
            fecha_registro || null
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear tarjeta:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe una tarjeta con ese número'
            });
        }

        res.status(500).json({ mensaje: 'Error al crear tarjeta' });
    }
};

// Actualizar tarjeta
const actualizarTarjeta = async (req, res) => {
    const { id } = req.params;

    const {
        numero_tarjeta,
        nombre_usuario,
        dpi_usuario,
        telefono,
        correo,
        saldo,
        estado,
        fecha_registro
    } = req.body;

    try {
        if (!numero_tarjeta || !nombre_usuario) {
            return res.status(400).json({
                mensaje: 'El número de tarjeta y el nombre del usuario son obligatorios'
            });
        }

        const result = await pool.query(`
            UPDATE tarjetas
            SET
                numero_tarjeta = $1,
                nombre_usuario = $2,
                dpi_usuario = $3,
                telefono = $4,
                correo = $5,
                saldo = $6,
                estado = $7,
                fecha_registro = $8
            WHERE id = $9
            RETURNING *
        `, [
            numero_tarjeta,
            nombre_usuario,
            dpi_usuario,
            telefono,
            correo,
            saldo || 0,
            estado || 'Activa',
            fecha_registro,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Tarjeta no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tarjeta:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe una tarjeta con ese número'
            });
        }

        res.status(500).json({ mensaje: 'Error al actualizar tarjeta' });
    }
};

// Eliminar tarjeta
const eliminarTarjeta = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM tarjetas
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Tarjeta no encontrada' });
        }

        res.json({ mensaje: 'Tarjeta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarjeta:', error);
        res.status(500).json({ mensaje: 'Error al eliminar tarjeta' });
    }
};

module.exports = {
    obtenerTarjetas,
    obtenerTarjetaPorId,
    crearTarjeta,
    actualizarTarjeta,
    eliminarTarjeta
};