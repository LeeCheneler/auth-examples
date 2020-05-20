import axios from "axios";
import type { Item } from "../models/item";
import { config } from "../utils/config";

interface CreateApiClientOptions {
  accessToken: string;
}

export const createApiClient = (options: CreateApiClientOptions) => {
  const client = axios.create({
    baseURL: config.api.baseUrl,
    headers: { Authorization: `Bearer ${options.accessToken}` },
  });

  return {
    items: {
      get: () => client.get<Item[]>("/items"),
    },
  };
};
