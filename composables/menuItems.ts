import { useSupabaseClient } from "#imports";

export const useMenuItems = () => {
  const supabase = useSupabaseClient();
  const menuItems = ref<never[] | null>([]);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase.from("menu_items").select();
      menuItems.value = data;
    } catch (error) {
      //
    }
  };

  return { menuItems, fetchMenuItems };
};
