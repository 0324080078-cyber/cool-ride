interface PricingConfig {
  dayBaseFare: number;
  dayPerKm: number;
  dayPerMinute: number;
  nightBaseFare: number;
  nightMaxFare: number;
  nightStartHour: number;
  nightEndHour: number;
  surgeMultiplier: number;
}

const config: PricingConfig = {
  dayBaseFare: parseFloat(process.env.DAY_BASE_FARE || '3'),
  dayPerKm: parseFloat(process.env.DAY_PER_KM || '0.5'),
  dayPerMinute: parseFloat(process.env.DAY_PER_MINUTE || '0.2'),
  nightBaseFare: parseFloat(process.env.NIGHT_BASE_FARE || '15'),
  nightMaxFare: parseFloat(process.env.NIGHT_MAX_FARE || '20'),
  nightStartHour: parseInt(process.env.NIGHT_START_HOUR || '22', 10),
  nightEndHour: parseInt(process.env.NIGHT_END_HOUR || '3', 10),
  surgeMultiplier: parseFloat(process.env.SURGE_MULTIPLIER || '1.5'),
};

export const isNightTime = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  
  if (config.nightStartHour > config.nightEndHour) {
    // Night period crosses midnight (e.g., 22:00 - 03:00)
    return hour >= config.nightStartHour || hour < config.nightEndHour;
  } else {
    // Night period doesn't cross midnight
    return hour >= config.nightStartHour && hour < config.nightEndHour;
  }
};

interface FareEstimateParams {
  distance: number; // in kilometers
  duration: number; // in minutes
  isDayTime?: boolean;
  surgeMultiplier?: number;
}

export const calculateFare = ({
  distance,
  duration,
  isDayTime = true,
  surgeMultiplier = 1,
}: FareEstimateParams): number => {
  if (!isDayTime) {
    // Night pricing
    const baseFare = config.nightBaseFare;
    const distanceCharge = distance * config.dayPerKm * 1.5; // 1.5x multiplier for night
    const fare = baseFare + distanceCharge;
    
    // Apply surge multiplier
    const finalFare = fare * surgeMultiplier;
    
    // Cap at max fare
    return Math.min(finalFare, config.nightMaxFare * surgeMultiplier);
  } else {
    // Day pricing
    const baseFare = config.dayBaseFare;
    const distanceCharge = distance * config.dayPerKm;
    const timeCharge = duration * config.dayPerMinute;
    const fare = baseFare + distanceCharge + timeCharge;
    
    // Apply surge multiplier
    return fare * surgeMultiplier;
  }
};

export const getFareEstimate = (
  distance: number,
  duration: number,
  date: Date = new Date()
): {
  estimatedFare: number;
  isDayRate: boolean;
  breakdown: {
    baseFare: number;
    distanceCharge: number;
    timeCharge: number;
    surgeMultiplier: number;
  };
} => {
  const isDayTime = !isNightTime(date);
  const baseFare = isDayTime ? config.dayBaseFare : config.nightBaseFare;
  const distanceCharge = distance * config.dayPerKm * (isDayTime ? 1 : 1.5);
  const timeCharge = isDayTime ? duration * config.dayPerMinute : 0;
  const estimatedFare = calculateFare({
    distance,
    duration,
    isDayTime,
    surgeMultiplier: 1,
  });

  return {
    estimatedFare: Math.round(estimatedFare * 100) / 100,
    isDayRate: isDayTime,
    breakdown: {
      baseFare,
      distanceCharge: Math.round(distanceCharge * 100) / 100,
      timeCharge: Math.round(timeCharge * 100) / 100,
      surgeMultiplier: 1,
    },
  };
};
