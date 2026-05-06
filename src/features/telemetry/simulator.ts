import { EventEmitter } from 'events';

export type TirePressures = {
  frontLeft: number;
  frontRight: number;
  rearLeft: number;
  rearRight: number;
};

export type TelemetryReading = {
  timestamp: number;
  odometerKm: number;
  tirePressurePsi: TirePressures;
  engineTempC: number;
  fuelLevelPct: number;
  batteryVolts: number;
};

export type TelemetryEventMap = {
  reading: [TelemetryReading];
};

const TICK_INTERVAL_MS = 2000;

const DEFAULTS = {
  odometerKm: 8742,
  tirePressurePsi: {
    frontLeft: 32,
    frontRight: 32,
    rearLeft: 32,
    rearRight: 32,
  } satisfies TirePressures,
  engineTempC: 88,
  fuelLevelPct: 64,
  batteryVolts: 12.6,
};

function jitter(value: number, range: number): number {
  return value + (Math.random() - 0.5) * range * 2;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

class TelemetrySimulator extends EventEmitter<TelemetryEventMap> {
  private timer: ReturnType<typeof setInterval> | null = null;
  private current: TelemetryReading;

  constructor() {
    super();
    this.current = this.seed();
  }

  private seed(): TelemetryReading {
    return {
      timestamp: Date.now(),
      odometerKm: DEFAULTS.odometerKm,
      tirePressurePsi: { ...DEFAULTS.tirePressurePsi },
      engineTempC: DEFAULTS.engineTempC,
      fuelLevelPct: DEFAULTS.fuelLevelPct,
      batteryVolts: DEFAULTS.batteryVolts,
    };
  }

  private nextReading(prev: TelemetryReading): TelemetryReading {
    return {
      timestamp: Date.now(),
      odometerKm: Number((prev.odometerKm + Math.random() * 0.05).toFixed(2)),
      tirePressurePsi: {
        frontLeft: Number(clamp(jitter(prev.tirePressurePsi.frontLeft, 0.3), 24, 38).toFixed(1)),
        frontRight: Number(clamp(jitter(prev.tirePressurePsi.frontRight, 0.3), 24, 38).toFixed(1)),
        rearLeft: Number(clamp(jitter(prev.tirePressurePsi.rearLeft, 0.3), 24, 38).toFixed(1)),
        rearRight: Number(clamp(jitter(prev.tirePressurePsi.rearRight, 0.3), 24, 38).toFixed(1)),
      },
      engineTempC: Number(clamp(jitter(prev.engineTempC, 1.5), 70, 115).toFixed(1)),
      fuelLevelPct: Number(clamp(prev.fuelLevelPct - Math.random() * 0.05, 0, 100).toFixed(1)),
      batteryVolts: Number(clamp(jitter(prev.batteryVolts, 0.05), 11.4, 14.6).toFixed(2)),
    };
  }

  start(): void {
    if (this.timer) return;
    this.emit('reading', this.current);
    this.timer = setInterval(() => {
      this.current = this.nextReading(this.current);
      this.emit('reading', this.current);
    }, TICK_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset(): void {
    this.current = this.seed();
    this.emit('reading', this.current);
  }

  getCurrent(): TelemetryReading {
    return this.current;
  }
}

export const telemetrySimulator = new TelemetrySimulator();
