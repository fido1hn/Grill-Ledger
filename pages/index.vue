<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow p-6">
      <!-- <h1 class="mb-4 text-center text-xl font-medium">Point of sale</h1> -->
      <h2 class="mb-4 text-2xl font-bold">Menu Items</h2>

      <!-- Menu Items -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
        <button
          v-for="item in menuItems"
          :key="item.item_id"
          @click="addToOrder(item)"
          v-motion
          :initial="{ scale: 1 }"
          :tapped="{ scale: 0.8 }"
          :transition="{
            type: 'spring',
            stiffness: 500,
            damping: 15,
            mass: 0.1,
          }"
          class="rounded-lg bg-gray-100 p-4 text-left transition duration-150 ease-in-out hover:bg-gray-200 dark:bg-gray-800"
        >
          <div class="font-semibold">
            {{ item.name }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            ₦ {{ item.sale_price }}
          </div>
        </button>
      </div>
    </div>

    <div class="p-6 md:w-1/3">
      <!-- Current Order -->
      <div
        class="mb-8 overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <h2 class="mb-4 text-2xl font-bold">Current Order</h2>
            <UButton
              icon="i-heroicons-arrow-path-solid"
              variant="soft"
              size="md"
              square
              @click="order = []"
            />
          </div>
          <div v-if="order.length === 0" class="text-gray-500">
            No items in the order.
          </div>
          <ul v-else class="mb-4 space-y-2">
            <li
              v-for="item in order"
              :key="item.item_id"
              class="flex items-center justify-between"
            >
              <span> {{ item.name }} x {{ item.quantity }} </span>
              <span class="flex items-center gap-2">
                ₦ {{ item.sale_price * item.quantity }}
                <button
                  @click="removeFromOrder(item.item_id)"
                  class="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                >
                  <MinusIcon class="h-4 w-4 dark:text-gray-900" />
                </button>
              </span>
            </li>
            <li
              v-if="packsNeeded > 0 && !customerOwnPack"
              class="flex items-center justify-between text-green-600"
            >
              <span>Takeaway Pack(s) ({{ packsNeeded }})</span>
              <span>₦ {{ packsNeeded * PACK_PRICE }}</span>
            </li>
          </ul>
          <div class="mb-8 mt-4 flex items-center">
            <UCheckbox
              id="customerOwnPack"
              v-model="customerOwnPack"
              class="mr-2"
            />
            <label for="customerOwnPack" class="font-semibold"
              >Customer pack</label
            >
          </div>
          <div class="mb-4">
            <label for="paymentType" class="mb-2 block text-base font-semibold"
              >Payment Type:</label
            >
            <USelect
              v-model="paymentType"
              id="paymentType"
              :options="paymentTypes"
            />
          </div>
        </div>
        <div
          class="flex items-center justify-between bg-gray-50 px-6 py-4 dark:bg-gray-950"
        >
          <h3 class="text-xl font-bold">Total:</h3>
          <span class="text-xl font-bold">₦ {{ totalAmount }}</span>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <UButton
          size="md"
          class="text-md font-bold"
          @click="printReceipt"
          variant="soft"
        >
          Print Receipt
        </UButton>
        <UButton
          size="md"
          class="text-md font-bold"
          @click="saveOrder"
          color="primary"
        >
          Save Order
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MinusIcon } from "lucide-vue-next";
import type { MenuItem, OrderItem } from "~/types";

useHead({
  title: "Home",
});

const PACK_PRICE = 200;

const { menuItems, fetchMenuItems } = useMenuItems();
await fetchMenuItems();

const order = ref<OrderItem[]>([]);
const customerOwnPack = ref(false);
const paymentTypes = ["card", "transfer", "cash"];
const paymentType = ref(paymentTypes[0]);

const addToOrder = (item: MenuItem): void => {
  const existingItem = order.value.find(
    (orderItem: OrderItem) => orderItem.item_id === item.item_id,
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    order.value.push({ ...item, quantity: 1 });
  }
};

const packsNeeded = computed(() => {
  const packItems = order.value.filter(
    (item: OrderItem) => item.requires_packaging,
  );
  const bbqChickenCount =
    order.value.find((item) => item.name.includes("BBQ"))?.quantity || 0;
  return Math.max(
    0,
    packItems.reduce((sum, item) => sum + item.quantity, 0) - bbqChickenCount,
  );
});

const removeFromOrder = (itemId: number): void => {
  const index = order.value.findIndex((item) => item.item_id === itemId);
  if (index !== -1) {
    if (order.value[index].quantity > 1) {
      order.value[index].quantity -= 1;
    } else {
      order.value.splice(index, 1);
    }
  }
};

const saveOrder = () => {
  // Sending the order to supabase
  console.log("Saving order:", {
    items: order.value,
    total: totalAmount.value,
    paymentType: paymentType.value,
    customerOwnPack: customerOwnPack.value,
  });
  alert("Order saved successfully!");
};

const printReceipt = () => {
  // printable receipt
  console.log("Printing receipt for order:", {
    items: order.value,
    total: totalAmount.value,
    paymentType: paymentType.value,
    customerOwnPack: customerOwnPack.value,
  });
  alert("Receipt printed successfully!");
};

const totalAmount = computed(() => {
  const itemsTotal = order.value.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  const packCost = customerOwnPack.value ? 0 : packsNeeded.value * PACK_PRICE;
  return itemsTotal + packCost;
});
</script>
