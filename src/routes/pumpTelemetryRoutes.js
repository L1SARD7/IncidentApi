const express = require('express');
const { createTelemetry } = require('../controllers/pumpTelemetryController');
const { validateRequest } = require('../middleware/validateRequest');
const { createPumpTelemetryValidator } = require('../validators/pumpTelemetryValidators');

const router = express.Router();

// POST /api/v1/pumps/telemetry
router.post('/telemetry', createPumpTelemetryValidator, validateRequest, createTelemetry);

module.exports = router;

