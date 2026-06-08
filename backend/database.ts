import { AppDataSource } from "./src/lib/data-source";

const normalizeParams = (params: any[]) => {
  if (params.length === 0) return [];
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
};

const pool = {
  query: async (sql: string, ...params: any[]) => {
    const rows = await AppDataSource.query(sql, normalizeParams(params));
    return [rows];
  },
  execute: async (sql: string, ...params: any[]) => {
    const rows = await AppDataSource.query(sql, normalizeParams(params));
    return [rows];
  },
};

export default pool;
