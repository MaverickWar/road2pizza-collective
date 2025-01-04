import { Tables } from '@/integrations/supabase/types/database';

export type PizzaType = Tables<'pizza_types'>;

export interface PizzaTypeUpdatePayload extends Partial<PizzaType> {
  name?: string;
  slug?: string;
}