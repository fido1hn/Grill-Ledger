<template>
  <div class="flex flex-col rounded-lg bg-gray-100 p-4">
    <button @click="$emit('add-to-order', item)" class="flex-grow text-left">
      <div class="font-semibold">{{ item.name }}</div>
      <div class="text-sm text-gray-600">${{ item.sale_price }}</div>
    </button>

    <!-- Lower Bar -->
    <div
      class="mt-2 flex items-center justify-between border-t border-gray-200 pt-2"
    >
      <button
        @click="$emit('remove-from-order', item.item_id)"
        class="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
        :disabled="!quantity"
      >
        <MinusIcon class="h-4 w-4" />
      </button>

      <div class="relative">
        <UPopover>
          <UButton
            variant="soft"
            class="rounded px-2 py-1 font-medium hover:bg-gray-200"
          >
            {{ quantity }}
          </UButton>

          <template #panel="{ close }">
            <NumberPad
              :temp-quantity="tempQuantity"
              @append="$emit('append-to-temp-quantity', $event)"
              @clear="$emit('clear-temp-quantity')"
              @confirm="$emit('confirm-quantity', item, close)"
            />
          </template>
        </UPopover>
      </div>

      <button
        @click="$emit('add-to-order', item)"
        class="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
      >
        <PlusIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MinusIcon, PlusIcon } from "lucide-vue-next";
import type { MenuItem } from "~/types";

defineProps<{
  item: MenuItem;
  quantity: number;
  tempQuantity: string;
}>();

defineEmits<{
  (e: "add-to-order", item: MenuItem): void;
  (e: "remove-from-order", itemId: number): void;
  (e: "append-to-temp-quantity", digit: number): void;
  (e: "clear-temp-quantity"): void;
  (e: "confirm-quantity", item: MenuItem, close: () => void): void;
}>();
</script>
