import express from "express";

export default async () => {
  const app = express();
  await require('./loaders').default(app);
  return app
}