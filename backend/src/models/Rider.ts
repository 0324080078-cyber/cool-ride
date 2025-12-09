import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

interface RiderAttributes {
  id: string;
  userId: string;
  fullName: string;
  profilePhoto?: string;
  ghanaId?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
  rating: number;
  totalTrips: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isOnline: boolean;
  currentLocation?: object;
  totalEarnings: number;
  bankAccount?: string;
  bankName?: string;
  momoNumber?: string;
  momoNetwork?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RiderCreationAttributes extends Optional<RiderAttributes, 'id' | 'profilePhoto' | 'ghanaId' | 'licenseNumber' | 'licenseExpiry' | 'rating' | 'totalTrips' | 'status' | 'isOnline' | 'currentLocation' | 'totalEarnings' | 'bankAccount' | 'bankName' | 'momoNumber' | 'momoNetwork'> {}

class Rider extends Model<RiderAttributes, RiderCreationAttributes> implements RiderAttributes {
  public id!: string;
  public userId!: string;
  public fullName!: string;
  public profilePhoto?: string;
  public ghanaId?: string;
  public licenseNumber?: string;
  public licenseExpiry?: Date;
  public rating!: number;
  public totalTrips!: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'suspended';
  public isOnline!: boolean;
  public currentLocation?: object;
  public totalEarnings!: number;
  public bankAccount?: string;
  public bankName?: string;
  public momoNumber?: string;
  public momoNetwork?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rider.init(
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
    ghanaId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licenseExpiry: {
      type: DataTypes.DATE,
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
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
      defaultValue: 'pending',
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    currentLocation: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    momoNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    momoNetwork: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rider',
    tableName: 'riders',
  }
);

// Define associations
Rider.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Rider, { foreignKey: 'userId', as: 'riderProfile' });

export default Rider;
