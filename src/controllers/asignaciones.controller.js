const pool = require('../config/db');

// Obtener todas las asignaciones
const obtenerAsignaciones = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.id,
                a.id_empleado,
                e.nombre || ' ' || e.apellido AS empleado,
                a.id_unidad,
                'Unidad ' || u.id AS unidad,
                a.id_linea,
                l.nombre AS linea,
                a.fecha_asignacion,
                TO_CHAR(a.fecha_asignacion, 'YYYY-MM-DD') AS fecha_asignacion_formato,
                a.estado
            FROM asignaciones a
            INNER JOIN empleados e
                ON a.id_empleado = e.id
            INNER JOIN unidades u
                ON a.id_unidad = u.id
            INNER JOIN lineas l
                ON a.id_linea = l.id
            ORDER BY a.id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({ mensaje: 'Error al obtener asignaciones' });
    }
};

// Obtener una asignación por ID
const obtenerAsignacionPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                a.id,
                a.id_empleado,
                e.nombre || ' ' || e.apellido AS empleado,
                a.id_unidad,
                'Unidad ' || u.id AS unidad,
                a.id_linea,
                l.nombre AS linea,
                a.fecha_asignacion,
                TO_CHAR(a.fecha_asignacion, 'YYYY-MM-DD') AS fecha_asignacion_formato,
                a.estado
            FROM asignaciones a
            INNER JOIN empleados e
                ON a.id_empleado = e.id
            INNER JOIN unidades u
                ON a.id_unidad = u.id
            INNER JOIN lineas l
                ON a.id_linea = l.id
            WHERE a.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Asignación no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener asignación:', error);
        res.status(500).json({ mensaje: 'Error al obtener asignación' });
    }
};

// Obtener catálogos para selects
const obtenerCatalogosAsignaciones = async (req, res) => {
    try {
        const empleados = await pool.query(`
            SELECT
                id,
                nombre || ' ' || apellido AS nombre
            FROM empleados
            ORDER BY id ASC
        `);

        const unidades = await pool.query(`
            SELECT
                id,
                'Unidad ' || id AS nombre
            FROM unidades
            ORDER BY id ASC
        `);

        const lineas = await pool.query(`
            SELECT
                id,
                nombre
            FROM lineas
            ORDER BY id ASC
        `);

        res.json({
            empleados: empleados.rows,
            unidades: unidades.rows,
            lineas: lineas.rows
        });
    } catch (error) {
        console.error('Error al obtener catálogos:', error);
        res.status(500).json({ mensaje: 'Error al obtener catálogos' });
    }
};

// Crear asignación
const crearAsignacion = async (req, res) => {
    const {
        id_empleado,
        id_unidad,
        id_linea,
        fecha_asignacion,
        estado
    } = req.body;

    try {
        if (!id_empleado || !id_unidad || !id_linea || !fecha_asignacion) {
            return res.status(400).json({
                mensaje: 'Empleado, unidad, línea y fecha de asignación son obligatorios'
            });
        }

        const result = await pool.query(`
            INSERT INTO asignaciones (
                id_empleado,
                id_unidad,
                id_linea,
                fecha_asignacion,
                estado
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [
            id_empleado,
            id_unidad,
            id_linea,
            fecha_asignacion,
            estado || 'Activa'
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear asignación:', error);

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'El empleado, unidad o línea seleccionada no existe'
            });
        }

        res.status(500).json({ mensaje: 'Error al crear asignación' });
    }
};

// Actualizar asignación
const actualizarAsignacion = async (req, res) => {
    const { id } = req.params;

    const {
        id_empleado,
        id_unidad,
        id_linea,
        fecha_asignacion,
        estado
    } = req.body;

    try {
        if (!id_empleado || !id_unidad || !id_linea || !fecha_asignacion) {
            return res.status(400).json({
                mensaje: 'Empleado, unidad, línea y fecha de asignación son obligatorios'
            });
        }

        const result = await pool.query(`
            UPDATE asignaciones
            SET
                id_empleado = $1,
                id_unidad = $2,
                id_linea = $3,
                fecha_asignacion = $4,
                estado = $5
            WHERE id = $6
            RETURNING *
        `, [
            id_empleado,
            id_unidad,
            id_linea,
            fecha_asignacion,
            estado || 'Activa',
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Asignación no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar asignación:', error);

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: 'El empleado, unidad o línea seleccionada no existe'
            });
        }

        res.status(500).json({ mensaje: 'Error al actualizar asignación' });
    }
};

// Eliminar asignación
const eliminarAsignacion = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            DELETE FROM asignaciones
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Asignación no encontrada' });
        }

        res.json({ mensaje: 'Asignación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({ mensaje: 'Error al eliminar asignación' });
    }
};

module.exports = {
    obtenerAsignaciones,
    obtenerAsignacionPorId,
    obtenerCatalogosAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacion
};