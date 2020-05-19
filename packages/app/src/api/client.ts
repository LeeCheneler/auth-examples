import axios from "axios";
import type { Item } from "../models/item";
import { config } from "../utils/config";

interface CreateApiClientOptions {
  accessToken?: string;
}

export const createApiClient = (options: CreateApiClientOptions) => {
  const headers: any = {};

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  const client = axios.create({
    baseURL: config.api.baseUrl,
    headers,
  });

  return {
    items: {
      get: () => client.get<Item[]>("/items"),
    },
  };
};
