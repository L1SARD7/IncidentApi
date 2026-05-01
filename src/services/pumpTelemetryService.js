const prisma = require('../lib/prisma');

const ingestPumpTelemetry = async ({
  pumpId,
  time,
  voltageV,
  currentA,
  vibrationRms,
  temperatureC,
  pressureIn,
  pressureOut
}) => {
  const existingPump = await prisma.pump.findUnique({ where: { id: Number(pumpId) } });
  if (!existingPump) {
    throw new Error('Pump not found');
  }

  const parsedTime = new Date(time);
  if (Number.isNaN(parsedTime.getTime())) {
    throw new Error('Invalid telemetry time');
  }
  // TIMESTAMP(0): truncate sub-second precision
  parsedTime.setMilliseconds(0);

  return prisma.pumpTelemetry.create({
    data: {
      pumpId: Number(pumpId),
      time: parsedTime,
      voltageV: Number(voltageV),
      currentA: Number(currentA),
      vibrationRms: Number(vibrationRms),
      temperatureC: Number(temperatureC),
      pressureIn: Number(pressureIn),
      pressureOut: Number(pressureOut)
    }
  });
};

module.exports = { ingestPumpTelemetry };

