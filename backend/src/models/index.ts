// Export all models from a central location
export { default as User } from './User';
export { default as Passenger } from './Passenger';
export { default as Rider } from './Rider';
export { default as Vehicle } from './Vehicle';
export { default as Trip } from './Trip';

// Initialize all model associations
import User from './User';
import Passenger from './Passenger';
import Rider from './Rider';
import Vehicle from './Vehicle';
import Trip from './Trip';

// Associations are defined in individual model files
// This file just provides a convenient import point

export const initializeModels = () => {
  // Models are already initialized when imported
  console.log('✅ Database models initialized');
};
