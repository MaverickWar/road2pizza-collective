import { Database } from '@/integrations/supabase/types/generated';

export type PizzaType = Database['public']['Tables']['pizza_types']['Row'];