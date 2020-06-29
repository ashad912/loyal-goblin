import expressLoader from './express';
import mongooseLoader from './mongoose';
import logger from '@logger';


export default async (app) => {
  await mongooseLoader();
  logger.info('DB loaded and connected!');

  await expressLoader(app);
  logger.info('Express loaded');
};