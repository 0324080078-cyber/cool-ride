import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Rider from './Rider';

interface VehicleAttributes {
  id: string;
  riderId: string;
  vehicleType: string;
  color: string;
  plateNumber: string;
  capacity: number;
  registrationDoc?: string;
  insuranceDoc?: string;
  insuranceExpiry?: Date;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id' | 'registrationDoc' | 'insuranceDoc' | 'insuranceExpiry' | 'isVerified'> {}

class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: string;
  public riderId!: string;
  public vehicleType!: string;
  public color!: string;
  public plateNumber!: string;
  public capacity!: number;
  public registrationDoc?: string;
  public insuranceDoc?: string;
  public insuranceExpiry?: Date;
  public isVerified!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    riderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'riders',
        key: 'id',
      },
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Keke/Pragia',
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      validate: {
        min: 1,
        max: 6,
      },
    },
    registrationDoc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceDoc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
  }
);

// Define associations
Vehicle.belongsTo(Rider, { foreignKey: 'riderId', as: 'rider' });
Rider.hasOne(Vehicle, { foreignKey: 'riderId', as: 'vehicle' });

export default Vehicle;
