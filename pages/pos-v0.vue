<template>
  <div class="container mx-auto p-4">
    <div class="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
      <div class="p-6">
        <h2 class="mb-4 text-2xl font-bold">Menu Items</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="addToOrder(item)"
            class="rounded-lg bg-gray-100 p-4 text-left transition duration-150 ease-in-out hover:bg-gray-200"
          >
            <div class="font-semibold">{{ item.name }}</div>
            <div class="text-sm text-gray-600">
              ${{ item.price.toFixed(2) }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
      <div class="p-6">
        <h2 class="mb-4 text-2xl font-bold">Current Order</h2>
        <div v-if="order.length === 0" class="text-gray-500">
          No items in the order.
        </div>
        <ul v-else class="mb-4 space-y-2">
          <li
            v-for="item in order"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <span> {{ item.name }} x {{ item.quantity }} </span>
            <span class="flex items-center gap-2">
              ${{ (item.price * item.quantity).toFixed(2) }}
              <button
                @click="removeFromOrder(item.id)"
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
            <span>${{ takeawayPackPrice.toFixed(2) }}</span>
          </li>
        </ul>
        <div class="mb-4 flex items-center">
          <input
            type="checkbox"
            id="customerOwnPack"
            v-model="customerOwnPack"
            class="mr-2"
          />
          <label for="customerOwnPack">Customer brought own pack</label>
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
        <span class="text-xl font-bold">${{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <button
        @click="saveOrder"
        class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        Save Order
      </button>
      <button
        @click="printReceipt"
        class="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
      >
        Print Receipt
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { MinusIcon } from "lucide-vue-next";

// Define the structure for a menu item
const MenuItem = {
  id: Number,
  name: String,
  price: Number,
  category: String,
};

// Define the structure for an order item
const OrderItem = {
  ...MenuItem,
  quantity: Number,
};

// Sample menu items
const menuItems = [
  { id: 1, name: "Rice", price: 3.99, category: "main" },
  { id: 2, name: "Spaghetti", price: 4.99, category: "main" },
  { id: 3, name: "Pepper Chicken", price: 6.99, category: "protein" },
  { id: 4, name: "BBQ Chicken", price: 7.99, category: "protein" },
  { id: 5, name: "Soda", price: 1.99, category: "drink" },
];

const order = ref([]);
const takeawayPackPrice = 0.5;
const customerOwnPack = ref(false);
const paymentType = ref("card");

const addToOrder = (item) => {
  const existingItem = order.value.find(
    (orderItem) => orderItem.id === item.id,
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    order.value.push({ ...item, quantity: 1 });
  }
};

const removeFromOrder = (itemId) => {
  const index = order.value.findIndex((item) => item.id === itemId);
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

const totalAmount = computed(() => {
  const itemsTotal = order.value.reduce(
    (sum, item) => sum + item.price * item.quantity,
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
</script>
