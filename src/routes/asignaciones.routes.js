const express = require('express');
const router = express.Router();

const {
    obtenerAsignaciones,
    obtenerAsignacionPorId,
    obtenerCatalogosAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    eliminarAsignacion
} = require('../controllers/asignaciones.controller');

// Esta ruta va antes de /:id
router.get('/catalogos', obtenerCatalogosAsignaciones);

router.get('/', obtenerAsignaciones);
router.get('/:id', obtenerAsignacionPorId);
router.post('/', crearAsignacion);
router.put('/:id', actualizarAsignacion);
router.delete('/:id', eliminarAsignacion);

module.exports = router;