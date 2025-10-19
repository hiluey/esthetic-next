// lib/otel-setup.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { MySQLInstrumentation } from '@opentelemetry/instrumentation-mysql';

const instrumentations = Object.values(getNodeAutoInstrumentations()).filter(
  (inst) => !(inst instanceof MySQLInstrumentation) // desativa MySQL
);

// ⚡ Opcional: se não usa Winston, desativa também
// .filter(inst => inst.constructor.name !== 'WinstonInstrumentation')

const sdk = new NodeSDK({ instrumentations });

export async function startTelemetry() {
  try {
    await sdk.start();
  } catch (err) {
    console.error("Erro iniciando telemetry:", err);
  }
}
