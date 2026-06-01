const pool = require('../config/db');

// Obtener todas las estaciones con el nombre de la línea
const obtenerEstaciones = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                e.id,
                e.nombre,
                e.ubicacion,
                e.linea_id,
                l.nombre AS linea_nombre,
                e.estado
             FROM estaciones e
             INNER JOIN lineas l ON e.linea_id = l.id
             ORDER BY e.id ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener estaciones:', error);

        res.status(500).json({
            mensaje: 'Error al obtener las estaciones',
            error: error.message
        });
    }
};

// Obtener estación por ID
const obtenerEstacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                e.id,
                e.nombre,
                e.ubicacion,
                e.linea_id,
                l.nombre AS linea_nombre,
                e.estado
             FROM estaciones e
             INNER JOIN lineas l ON e.linea_id = l.id
             WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Estación no encontrada'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener estación:', error);

        res.status(500).json({
            mensaje: 'Error al obtener la estación',
            error: error.message
        });
    }
};

// Crear estación
const crearEstacion = async (req, res) => {
    try {
        const { nombre, ubicacion, linea_id, estado } = req.body;

        const result = await pool.query(
            `INSERT INTO estaciones (nombre, ubicacion, linea_id, estado)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nombre, ubicacion, linea_id, estado]
        );

        res.status(201).json({
            mensaje: 'Estación creada correctamente',
            estacion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear estación:', error);

        res.status(500).json({
            mensaje: 'Error al crear la estación',
            error: error.message
        });
    }
};

// Actualizar estación
const actualizarEstacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ubicacion, linea_id, estado } = req.body;

        const result = await pool.query(
            `UPDATE estaciones
             SET nombre = $1,
                 ubicacion = $2,
                 linea_id = $3,
                 estado = $4
             WHERE id = $5
             RETURNING *`,
            [nombre, ubicacion, linea_id, estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Estación no encontrada'
            });
        }

        res.json({
            mensaje: 'Estación actualizada correctamente',
            estacion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar estación:', error);

        res.status(500).json({
            mensaje: 'Error al actualizar la estación',
            error: error.message
        });
    }
};

// Eliminar estación
const eliminarEstacion = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM estaciones WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Estación no encontrada'
            });
        }

        res.json({
            mensaje: 'Estación eliminada correctamente',
            estacion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar estación:', error);

        res.status(500).json({
            mensaje: 'Error al eliminar la estación',
            error: error.message
        });
    }
};

module.exports = {
    obtenerEstaciones,
    obtenerEstacionPorId,
    crearEstacion,
    actualizarEstacion,
    eliminarEstacion
};