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
              <button @click="removeFromPack(packIndex, itemIndex)">
                Remove
              </button>
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
            <button @click="removeAdditionalItem(index)">Remove</button>
          </li>
        </ul>
        <p class="mt-3">Total Packs: {{ currentOrder.packs.length }}</p>
        <!-- <p>Total: ${{ totalAmount.toFixed(2) }}</p> -->
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

const packPrice = 200;
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

const removeFromPack = () => {};

const removeAdditionalItem = () => {};
</script>
