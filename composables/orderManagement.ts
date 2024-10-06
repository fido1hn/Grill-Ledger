import { useSupabaseClient } from "#imports";
import type { OrderItem, SaleData } from "~/types";

export const useOrderManagement = () => {
  const supabase = useSupabaseClient();

  const saveOrderToDb = async (orderData: {
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    packagingCount: number;
  }) => {
    try {
      // Insert into sales table
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          total_amount: orderData.total,
          payment_method: orderData.paymentMethod,
          packaging_count: orderData.packagingCount,
        } as any)
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert into sale_items table
      const saleItems = orderData.items.map((item: OrderItem) => ({
        sale_id: (saleData as SaleData).sale_id,
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.sale_price,
      }));

      const { error: saleItemsError } = await supabase
        .from("sale_items")
        .insert(saleItems as any);

      if (saleItemsError) throw saleItemsError;

      return { success: true };
    } catch (error: unknown) {
      console.error("Error saving order:", (error as Error).message);
      return { success: false, error: (error as Error).message };
    }
  };
  return { saveOrderToDb };
};
