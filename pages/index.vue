<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow p-6">
      <h1 class="mb-4 text-xl font-medium">Point of sale</h1>

      <!-- Menu Items -->
      <div class="grid grid-cols-2 gap-3">
        <UButton
          color="primary"
          size="md"
          v-for="item in menuItems"
          :key="item.id"
          @click="addToOrder(item)"
        >
          <span class="text-base font-semibold">{{ item.name }}</span>
        </UButton>
      </div>
    </div>

    <div class="p-6 md:w-1/3">
      <!-- Current Order -->
      <div class="current-order">
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

        <!-- Checkout Button -->
        <button @click="checkout" :disabled="!hasItems">Checkout</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: "Home",
});

const { menuItems, fetchMenuItems } = useMenuItems();
fetchMenuItems();

const PACK_PRICE = 200;
const currentOrder = reactive({
  packs: [],
  additionalItems: [],
});

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
  console.log("packTotal =>", packTotal);
  console.log("additionalTotal =>", additionalTotal);
  console.log("packsCost =>", packsCost);
  return packTotal + additionalTotal + packsCost;
});
</script>
