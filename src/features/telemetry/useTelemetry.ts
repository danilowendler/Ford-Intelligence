import { useEffect } from 'react';
import { useVehicleStore } from '@/stores/useVehicleStore';
import { telemetrySimulator, type TelemetryReading } from './simulator';

export function useTelemetry(): TelemetryReading | null {
  const reading = useVehicleStore((s) => s.reading);
  const setReading = useVehicleStore((s) => s.setReading);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = telemetrySimulator.on((next: TelemetryReading) => {
      if (mounted) setReading(next);
    });
    telemetrySimulator.start();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [setReading]);

  return reading;
}

export function restartTelemetry(): void {
  telemetrySimulator.reset();
}
