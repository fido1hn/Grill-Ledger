<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow p-6">
      <!-- <h1 class="mb-4 text-center text-xl font-medium">Point of sale</h1> -->
      <h2 class="mb-4 text-2xl font-bold">Menu Items</h2>

      <!-- Menu Items -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div
          v-for="item in menuItems"
          :key="item.item_id"
          class="flex flex-col rounded-lg bg-gray-100 p-4"
        >
          <button @click="addToOrder(item)" class="flex-grow text-left">
            <div class="font-semibold">{{ item.name }}</div>
            <div class="text-sm text-gray-600">${{ item.sale_price }}</div>
          </button>

          <!-- Lower Bar -->
          <div
            class="mt-2 flex items-center justify-between border-t border-gray-200 pt-2"
          >
            <button
              @click="removeFromOrder(item.item_id)"
              class="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
              :disabled="!getItemQuantity(item.item_id)"
            >
              <MinusIcon class="h-4 w-4" />
            </button>

            <div class="relative">
              <button
                @click="toggleNumberPad(item.item_id)"
                class="rounded px-2 py-1 font-medium hover:bg-gray-200"
              >
                {{ getItemQuantity(item.item_id) }}
              </button>
              <div
                v-if="activeNumberPad === item.item_id"
                class="absolute bottom-full left-1/2 z-10 mb-2 w-52 -translate-x-1/2 transform rounded border border-gray-200 bg-white shadow-lg"
              >
                <div class="p-2">
                  <div class="mb-2 bg-gray-100 p-2 text-center">
                    {{
                      tempQuantity === "" ? "00" : tempQuantity.padStart(2, "0")
                    }}
                  </div>
                  <div class="grid grid-cols-3 gap-1">
                    <button
                      v-for="n in 9"
                      :key="n"
                      @click="appendToTempQuantity(n)"
                      class="rounded bg-gray-100 p-2 text-center hover:bg-gray-200"
                    >
                      {{ n }}
                    </button>
                    <button
                      @click="appendToTempQuantity(0)"
                      class="rounded bg-gray-100 p-2 text-center hover:bg-gray-200"
                    >
                      0
                    </button>
                    <button
                      @click="clearTempQuantity"
                      class="rounded bg-red-100 p-2 text-center hover:bg-red-200"
                    >
                      C
                    </button>
                    <button
                      @click="confirmQuantity(item)"
                      class="rounded bg-green-100 p-2 text-center hover:bg-green-200"
                    >
                      ✓
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="addToOrder(item)"
              class="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
            >
              <PlusIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
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
            <label
              for="paymentMethod"
              class="mb-2 block text-base font-semibold"
              >payment method:</label
            >
            <USelect
              v-model="paymentMethod"
              id="paymentMethod"
              :options="paymentMethods"
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
          :loading="pending"
          :disable="pending"
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
import { MinusIcon, PlusIcon } from "lucide-vue-next";
import type { MenuItem, OrderItem } from "~/types";

useHead({
  title: "Home",
});

const { saveOrderToDb } = useOrderManagement();
const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);
const PACK_PRICE = 200;

const { menuItems, fetchMenuItems } = useMenuItems();
await fetchMenuItems();

const order = ref<OrderItem[]>([]);
const customerOwnPack = ref(false);
const paymentMethods = ["card", "transfer", "cash"];
const paymentMethod = ref(paymentMethods[0]);
const activeNumberPad = ref<number | null>(null);
const tempQuantity = ref("");

const appendToTempQuantity = (digit: number) => {
  if (tempQuantity.value.length < 2) {
    tempQuantity.value += digit;
  }
};

const clearTempQuantity = () => {
  tempQuantity.value = "";
};

const confirmQuantity = (item: MenuItem) => {
  const newQuantity = parseInt(tempQuantity.value, 10);
  if (newQuantity > 0) {
    const existingItem = order.value.find(
      (orderItem) => orderItem.item_id === item.item_id,
    );
    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      order.value.push({ ...item, quantity: newQuantity });
    }
  }
  activeNumberPad.value = null;
  tempQuantity.value = "";
};

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

const getItemQuantity = (itemId: number): number => {
  const item = order.value.find(
    (orderItem: OrderItem) => orderItem.item_id === itemId,
  );
  return item ? item.quantity : 0;
};

const toggleNumberPad = (itemId: number): void => {
  if (activeNumberPad.value === itemId) {
    activeNumberPad.value = null;
  } else {
    activeNumberPad.value = itemId;
  }
};

const packsNeeded = computed(() => {
  const packItems = order.value.filter(
    (item: OrderItem) => item.requires_packaging,
  );
  const bbqChickenCount = order.value
    .filter((item) => item.name.toLowerCase().includes("bbq"))
    .reduce((sum, item) => sum + item.quantity, 0);
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

const saveOrder = async (): Promise<void> => {
  if (!order.value.length) return;

  pending.value = true;
  // Sending the order to supabase
  const result = await saveOrderToDb({
    items: order.value,
    total: totalAmount.value,
    paymentMethod: paymentMethod.value,
    packagingCount: packsNeeded.value,
  });

  if (result.success) {
    toastSuccess({
      title: "Success",
      description: "Order saved successfully!",
    });
    // Reset the order or perform any other necessary actions
    order.value = [];
    customerOwnPack.value = false;
    paymentMethod.value = paymentMethods[0];
    pending.value = false;
  } else {
    toastError({
      title: "Error",
      description: "Failed to save order. Please try again.",
    });
    pending.value = false;
  }
};

const printReceipt = () => {
  // printable receipt
  console.log("Printing receipt for order:", {
    items: order.value,
    total: totalAmount.value,
    paymentMethod: paymentMethod.value,
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
