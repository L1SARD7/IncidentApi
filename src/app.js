const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const pumpTelemetryRoutes = require('./routes/pumpTelemetryRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/incidents', incidentRoutes);
app.use('/api/v1/pumps', pumpTelemetryRoutes);

module.exports = app;