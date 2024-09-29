<template>
  <div class="flex flex-col md:flex-row">
    <div class="grow p-6 border border-red-500">
      <!-- <h1 class="mb-1 text-2xl font-medium">Welcome</h1> -->
      <SaleItemCard />
    </div>
    <div class="w-1/3 p-6 border border-green-500">
      <p>Receipt</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
useHead({
  title: 'Home',
});
</script>
