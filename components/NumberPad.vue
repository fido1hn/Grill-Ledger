<template>
  <div class="w-52 rounded border border-gray-200 bg-white shadow-lg">
    <div class="p-2">
      <div class="mb-2 bg-gray-100 p-2 text-center">
        {{ tempQuantity === "" ? "00" : tempQuantity.padStart(2, "0") }}
      </div>
      <div class="grid grid-cols-3 gap-1">
        <button
          v-for="n in 9"
          :key="n"
          @click="$emit('append', n)"
          class="rounded bg-gray-100 p-2 text-center hover:bg-gray-200"
        >
          {{ n }}
        </button>
        <button
          @click="$emit('append', 0)"
          class="rounded bg-gray-100 p-2 text-center hover:bg-gray-200"
        >
          0
        </button>
        <button
          @click="$emit('clear')"
          class="rounded bg-red-100 p-2 text-center hover:bg-red-200"
        >
          C
        </button>
        <button
          @click="$emit('confirm')"
          class="rounded bg-green-100 p-2 text-center hover:bg-green-200"
        >
          ✓
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  tempQuantity: string;
}>();

defineEmits<{
  (e: "append", digit: number): void;
  (e: "clear"): void;
  (e: "confirm"): void;
}>();
</script>
