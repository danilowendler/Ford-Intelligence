import { useEffect } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { telemetrySimulator, type TelemetryReading } from './simulator';

export function useTelemetry(): TelemetryReading | null {
  const reading = useVehicleStore((s) => s.reading);
  const setReading = useVehicleStore((s) => s.setReading);

  useEffect(() => {
    const handler = (next: TelemetryReading) => setReading(next);
    telemetrySimulator.on('reading', handler);
    telemetrySimulator.start();

    return () => {
      telemetrySimulator.off('reading', handler);
    };
  }, [setReading]);

  return reading;
}

export function restartTelemetry(): void {
  telemetrySimulator.reset();
}
