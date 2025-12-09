import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Passenger from './Passenger';
import Rider from './Rider';

interface TripAttributes {
  id: string;
  passengerId: string;
  riderId?: string;
  pickupLocation: object;
  pickupAddress: string;
  dropoffLocation: object;
  dropoffAddress: string;
  estimatedFare: number;
  actualFare?: number;
  distance?: number;
  duration?: number;
  status: 'pending' | 'accepted' | 'on-way' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  cancelledBy?: string;
  cancellationReason?: string;
  isDayRate: boolean;
  surgeMultiplier?: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  riderRating?: number;
  passengerRating?: number;
  startTime?: Date;
  endTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TripCreationAttributes extends Optional<TripAttributes, 'id' | 'riderId' | 'actualFare' | 'distance' | 'duration' | 'cancelledBy' | 'cancellationReason' | 'surgeMultiplier' | 'paymentMethod' | 'riderRating' | 'passengerRating' | 'startTime' | 'endTime'> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  public id!: string;
  public passengerId!: string;
  public riderId?: string;
  public pickupLocation!: object;
  public pickupAddress!: string;
  public dropoffLocation!: object;
  public dropoffAddress!: string;
  public estimatedFare!: number;
  public actualFare?: number;
  public distance?: number;
  public duration?: number;
  public status!: 'pending' | 'accepted' | 'on-way' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  public cancelledBy?: string;
  public cancellationReason?: string;
  public isDayRate!: boolean;
  public surgeMultiplier?: number;
  public paymentMethod?: string;
  public paymentStatus!: 'pending' | 'completed' | 'failed';
  public riderRating?: number;
  public passengerRating?: number;
  public startTime?: Date;
  public endTime?: Date;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    passengerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'passengers',
        key: 'id',
      },
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'riders',
        key: 'id',
      },
    },
    pickupLocation: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dropoffLocation: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    dropoffAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimatedFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    actualFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'on-way', 'arrived', 'in-progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    cancelledBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDayRate: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    surgeMultiplier: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.0,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    riderRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    passengerRating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Trip',
    tableName: 'trips',
  }
);

// Define associations
Trip.belongsTo(Passenger, { foreignKey: 'passengerId', as: 'passenger' });
Trip.belongsTo(Rider, { foreignKey: 'riderId', as: 'rider' });
Passenger.hasMany(Trip, { foreignKey: 'passengerId', as: 'trips' });
Rider.hasMany(Trip, { foreignKey: 'riderId', as: 'trips' });

export default Trip;
