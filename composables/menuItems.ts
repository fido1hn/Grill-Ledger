import { useSupabaseClient } from "#imports";
import type { MenuItem } from "~/types";

export const useMenuItems = () => {
  const supabase = useSupabaseClient();
  const menuItems = ref<MenuItem[]>([]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select()
        .order("item_id", { ascending: true });
      if (data) {
        menuItems.value = data as MenuItem[];
      } else {
        menuItems.value = [];
      }
    } catch (error) {
      //
    }
  };

  return { menuItems, fetchMenuItems };
};
