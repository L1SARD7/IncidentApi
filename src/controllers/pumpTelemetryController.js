const { ingestPumpTelemetry } = require('../services/pumpTelemetryService');

const createTelemetry = async (req, res) => {
  try {
    const {
      pump_id: pumpId,
      time,
      voltage_v: voltageV,
      current_a: currentA,
      vibration_rms: vibrationRms,
      temperature_c: temperatureC,
      pressure_in: pressureIn,
      pressure_out: pressureOut
    } = req.body;

    const created = await ingestPumpTelemetry({
      pumpId,
      time,
      voltageV,
      currentA,
      vibrationRms,
      temperatureC,
      pressureIn,
      pressureOut
    });

    return res.status(201).json(created);
  } catch (error) {
    const message = error?.message || 'Internal Server Error';
    if (
      message === 'Pump not found' ||
      message === 'Invalid telemetry time'
    ) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
};

module.exports = { createTelemetry };

