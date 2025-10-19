import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { MySQLInstrumentation } from '@opentelemetry/instrumentation-mysql';

// Pega todas as instrumentações padrão
const instrumentations = getNodeAutoInstrumentations();

// Filtra a instrumentação do MySQL para não carregar
const filteredInstrumentations = Object.values(instrumentations).filter(
  (inst) => !(inst instanceof MySQLInstrumentation)
);

const sdk = new NodeSDK({
  instrumentations: filteredInstrumentations,
});

export async function startTelemetry() {
  await sdk.start();
}
