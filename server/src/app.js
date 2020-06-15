import express from "express";
import getLoaders from '@loaders'

export default async () => {
  const app = express();
  await getLoaders(app);
  return app
}

// export async function getApp(app){
//   await getLoaders(app);
//   return app
// }

// const app = express();

// getApp(app)

// export default app