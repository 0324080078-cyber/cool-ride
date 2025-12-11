import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface PassengerAttributes {
  id: string;
  userId: string;
  fullName: string;
  profilePhoto?: string;
  rating: number;
  totalTrips: number;
  emergencyContact?: string;
  emergencyContactName?: string;
  favoriteLocations?: object;
  preferredPayment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PassengerCreationAttributes extends Optional<PassengerAttributes, 'id' | 'profilePhoto' | 'rating' | 'totalTrips' | 'emergencyContact' | 'emergencyContactName' | 'favoriteLocations' | 'preferredPayment'> {}

class Passenger extends Model<PassengerAttributes, PassengerCreationAttributes> implements PassengerAttributes {
  public id!: string;
  public userId!: string;
  public fullName!: string;
  public profilePhoto?: string;
  public rating!: number;
  public totalTrips!: number;
  public emergencyContact?: string;
  public emergencyContactName?: string;
  public favoriteLocations?: object;
  public preferredPayment?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Passenger.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    totalTrips: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    emergencyContact: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    favoriteLocations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    preferredPayment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Passenger',
    tableName: 'passengers',
  }
);

// Define associations
Passenger.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Passenger, { foreignKey: 'userId', as: 'passengerProfile' });

export default Passenger;
