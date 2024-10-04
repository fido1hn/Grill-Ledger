<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow p-6">
      <!-- <h1 class="mb-4 text-center text-xl font-medium">Point of sale</h1> -->
      <h2 class="mb-4 text-2xl font-bold">Menu Items</h2>

      <!-- Menu Items -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="addToOrderV0(item)"
          class="rounded-lg bg-gray-100 p-4 text-left transition duration-150 ease-in-out hover:bg-gray-200"
        >
          <div class="font-semibold">{{ item.name }}</div>
          <div class="text-sm text-gray-600">₦ {{ item.sale_price }}</div>
        </button>
      </div>
    </div>

    <div class="p-6 md:w-1/3">
      <!-- Current Order -->
      <!-- <div class="current-order">
        <h2 class="mb-4 text-xl font-medium">Current Order</h2>
        <div
          class="mb-2"
          v-for="(pack, packIndex) in currentOrder.packs"
          :key="packIndex"
        >
          <h3 class="font-medium">Pack {{ packIndex + 1 }}</h3>
          <ul>
            <li v-for="(item, itemIndex) in pack.items" :key="itemIndex">
              {{ item.name }}
              <UButton
                color="rose"
                class="ml-2"
                @click="removeFromPack(packIndex, itemIndex)"
              >
                Remove
              </UButton>
            </li>
          </ul>
        </div>

        <h3 class="text-base font-medium">Other Items</h3>
        <ul>
          <li
            v-for="(item, index) in currentOrder.additionalItems"
            :key="index"
          >
            {{ item.name }}
            <UButton
              class="ml-2"
              color="rose"
              @click="removeAdditionalItem(index)"
              >Remove</UButton
            >
          </li>
        </ul>
        <p class="mt-3">Total Packs: {{ currentOrder.packs.length }}</p>
        <p>Total: NGN{{ totalAmount }}</p>

        
        <button @click="checkout" :disabled="!hasItems">Checkout</button>
      </div> -->

      <div class="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
        <div class="p-6">
          <h2 class="mb-4 text-2xl font-bold">Current Order</h2>
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
                  <MinusIcon class="h-4 w-4" />
                </button>
              </span>
            </li>
            <li
              v-if="takeawayPackNeeded && !customerOwnPack"
              class="flex items-center justify-between text-green-600"
            >
              <span>Takeaway Pack</span>
              <span>${{ takeawayPackPrice }}</span>
            </li>
          </ul>
          <div class="mb-4 mt-4 flex items-center">
            <input
              type="checkbox"
              id="customerOwnPack"
              v-model="customerOwnPack"
              class="mr-2"
            />
            <label for="customerOwnPack">Customer pack</label>
          </div>
          <div class="mb-4">
            <label for="paymentType" class="mb-2 block">Payment Type:</label>
            <select
              id="paymentType"
              v-model="paymentType"
              class="w-full rounded border p-2"
            >
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between bg-gray-50 px-6 py-4">
          <h3 class="text-xl font-bold">Total:</h3>
          <span class="text-xl font-bold">₦ {{ totalAmountV0 }}</span>
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

useHead({
  title: "Home",
});

const { menuItems, fetchMenuItems } = useMenuItems();
await fetchMenuItems();

const PACK_PRICE = 200;

const currentOrder = reactive({
  packs: [],
  additionalItems: [],
});

const order = ref([]);
const takeawayPackPrice = 200;
const customerOwnPack = ref(false);
const paymentType = ref("card");

const addToOrder = (item) => {
  if (item.requires_packaging) {
    // If the last pack is full (already has a pack item), create a new pack
    if (
      currentOrder.packs.length === 0 ||
      currentOrder.packs[currentOrder.packs.length - 1].items.some(
        (i) => i.requires_packaging,
      )
    ) {
      currentOrder.packs.push({ items: [] });
    }
    // Add the item to the last pack
    currentOrder.packs[currentOrder.packs.length - 1].items.push({
      ...item,
    });
  } else {
    // Add non-pack items to additional items
    currentOrder.additionalItems.push({ ...item });
  }
};

const addToOrderV0 = (item) => {
  const existingItem = order.value.find(
    (orderItem) => orderItem.item_id === item.item_id,
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    order.value.push({ ...item, quantity: 1 });
  }
};

const removeFromOrder = (itemId) => {
  const index = order.value.findIndex((item) => item.item_id === itemId);
  if (index !== -1) {
    if (order.value[index].quantity > 1) {
      order.value[index].quantity -= 1;
    } else {
      order.value.splice(index, 1);
    }
  }
};

const takeawayPackNeeded = computed(() => {
  const hasMain = order.value.some((item) => item.category === "main");
  const hasPepperChicken = order.value.some(
    (item) => item.name === "Pepper Chicken",
  );
  const hasBBQChicken = order.value.some((item) => item.name === "BBQ Chicken");

  return hasMain && (!hasBBQChicken || (hasPepperChicken && !hasBBQChicken));
});

const totalAmountV0 = computed(() => {
  const itemsTotal = order.value.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  return (
    itemsTotal +
    (takeawayPackNeeded.value && !customerOwnPack.value ? takeawayPackPrice : 0)
  );
});

const saveOrder = () => {
  // In a real application, this would typically involve sending the order to a backend service
  console.log("Saving order:", {
    items: order.value,
    total: totalAmount.value,
    paymentType: paymentType.value,
    customerOwnPack: customerOwnPack.value,
  });
  alert("Order saved successfully!");
};

const printReceipt = () => {
  // In a real application, this would typically involve generating a printable receipt
  console.log("Printing receipt for order:", {
    items: order.value,
    total: totalAmount.value,
    paymentType: paymentType.value,
    customerOwnPack: customerOwnPack.value,
  });
  alert("Receipt printed successfully!");
};

const removeFromPack = (packIndex, itemIndex) => {
  currentOrder.packs[packIndex].items.splice(itemIndex, 1);
  // If the pack is empty after removal, remove the pack
  if (currentOrder.packs[packIndex].items.length === 0) {
    currentOrder.packs.splice(packIndex, 1);
  }
};

const removeAdditionalItem = (index) => {
  currentOrder.additionalItems.splice(index, 1);
};

const checkout = () => {};

const hasItems = computed(() => {
  return (
    currentOrder.packs.length > 0 || currentOrder.additionalItems.length > 0
  );
});

const totalAmount = computed(() => {
  const packTotal = currentOrder.packs.reduce((total, pack) => {
    return (
      total +
      pack.items.reduce((packTotal, item) => packTotal + item.sale_price, 0)
    );
  }, 0);
  const additionalTotal = currentOrder.additionalItems.reduce(
    (total, item) => total + item.sale_price,
    0,
  );
  const packsCost = currentOrder.packs.length * PACK_PRICE;
  return packTotal + additionalTotal + packsCost;
});
</script>
