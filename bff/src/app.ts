import express from "express";

export type BffConfig = {
  apiCoreUrl: string;
  apiCoreTimeoutMs: number;
};

export function createApp(_config: BffConfig) {
  return express();
}
