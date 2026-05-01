-- Pumping stations / pumps / telemetry tables (SQLite)

-- CreateTable
CREATE TABLE "Pumping_stations" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "location" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pump_models" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pump_states" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pumps" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "station_id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "model" INTEGER NOT NULL,
  "state" INTEGER NOT NULL,
  CONSTRAINT "pumps_station_id_foreign" FOREIGN KEY ("station_id") REFERENCES "Pumping_stations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "pumps_model_foreign" FOREIGN KEY ("model") REFERENCES "Pump_models" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "pumps_state_foreign" FOREIGN KEY ("state") REFERENCES "Pump_states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pumps_telemetry" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pump_id" INTEGER NOT NULL,
  "time" DATETIME NOT NULL,
  "voltage_v" REAL NOT NULL,
  "current_a" REAL NOT NULL,
  "vibration_rms" REAL NOT NULL,
  "temperature_c" REAL NOT NULL,
  "pressure_in" REAL NOT NULL,
  "pressure_out" REAL NOT NULL,
  CONSTRAINT "pumps_telemetry_pump_id_foreign" FOREIGN KEY ("pump_id") REFERENCES "Pumps" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

