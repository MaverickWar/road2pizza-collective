import { Database as DatabaseGenerated } from './generated';

export type Database = DatabaseGenerated;

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type DbFunctions = Database['public']['Functions'];

export type GetAuthConfigResponse = {
  confirmations_required: boolean;
};