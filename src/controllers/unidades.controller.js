const pool = require('../config/db');

// Obtener todas las unidades con el nombre de la línea
const obtenerUnidades = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                u.id,
                u.codigo,
                u.placa,
                u.modelo,
                u.capacidad,
                u.linea_id,
                l.nombre AS linea_nombre,
                u.estado
             FROM unidades u
             INNER JOIN lineas l ON u.linea_id = l.id
             ORDER BY u.id ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener unidades:', error);

        res.status(500).json({
            mensaje: 'Error al obtener las unidades',
            error: error.message
        });
    }
};

// Obtener unidad por ID
const obtenerUnidadPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                u.id,
                u.codigo,
                u.placa,
                u.modelo,
                u.capacidad,
                u.linea_id,
                l.nombre AS linea_nombre,
                u.estado
             FROM unidades u
             INNER JOIN lineas l ON u.linea_id = l.id
             WHERE u.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Unidad no encontrada'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener unidad:', error);

        res.status(500).json({
            mensaje: 'Error al obtener la unidad',
            error: error.message
        });
    }
};

// Crear unidad
const crearUnidad = async (req, res) => {
    try {
        const { codigo, placa, modelo, capacidad, linea_id, estado } = req.body;

        const result = await pool.query(
            `INSERT INTO unidades (codigo, placa, modelo, capacidad, linea_id, estado)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [codigo, placa, modelo, capacidad, linea_id, estado]
        );

        res.status(201).json({
            mensaje: 'Unidad creada correctamente',
            unidad: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear unidad:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe una unidad con esa placa',
                error: error.message
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear la unidad',
            error: error.message
        });
    }
};

// Actualizar unidad
const actualizarUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, placa, modelo, capacidad, linea_id, estado } = req.body;

        const result = await pool.query(
            `UPDATE unidades
             SET codigo = $1,
                 placa = $2,
                 modelo = $3,
                 capacidad = $4,
                 linea_id = $5,
                 estado = $6
             WHERE id = $7
             RETURNING *`,
            [codigo, placa, modelo, capacidad, linea_id, estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Unidad no encontrada'
            });
        }

        res.json({
            mensaje: 'Unidad actualizada correctamente',
            unidad: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar unidad:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                mensaje: 'Ya existe una unidad con esa placa',
                error: error.message
            });
        }

        res.status(500).json({
            mensaje: 'Error al actualizar la unidad',
            error: error.message
        });
    }
};

// Eliminar unidad
const eliminarUnidad = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM unidades WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Unidad no encontrada'
            });
        }

        res.json({
            mensaje: 'Unidad eliminada correctamente',
            unidad: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar unidad:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar la unidad',
            error: error.message
        });
    }
};

module.exports = {
    obtenerUnidades,
    obtenerUnidadPorId,
    crearUnidad,
    actualizarUnidad,
    eliminarUnidad
};