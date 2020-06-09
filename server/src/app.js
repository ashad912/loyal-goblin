import express from "express";
import getLoaders from '@loaders'

export default async () => {
  const app = express();
  await getLoaders(app);
  return app
}