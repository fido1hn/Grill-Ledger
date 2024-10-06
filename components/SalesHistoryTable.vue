<template>
  <div class="py-5">
    <UTable
      :loading="isLoading"
      :columns="columns"
      :rows="rows"
      :ui="{
        th: { padding: 'px-2 py-2' },
        td: { padding: 'px-2 py-2', color: 'text-gray-800 dark:text-gray-200' },
      }"
    >
      <template #sale_date-data="{ row }">
        <span>{{ formatDateTime(row.sale_date) }}</span>
      </template>

      <template #payment_method-data="{ row }">
        <div class="flex items-center gap-1">
          <UIcon :name="chooseIcon(row.payment_method)" class="h-4 w-4" />
          <span class="block">{{ row.payment_method }}</span>
        </div>
      </template>

      <template #total_amount-data="{ row }">
        <span>{{ formatAmount(row.total_amount) }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <div
      class="flex justify-end border-t border-gray-200 px-3 py-3.5 dark:border-gray-700"
    >
      <UPagination
        v-model="page"
        :page-count="rowCount"
        :total="sales.length"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SaleData } from "~/types";
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();

// Grab today's order and display it on the table
const sales = ref<SaleData[]>([]);

const fetchTodaySales = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .gte("sale_date", today.toISOString())
    .lt(
      "sale_date",
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    )
    .order("sale_date", { ascending: false });

  if (error) {
    console.error("Error fetching today's sales:", error);
    return;
  }

  sales.value = data;
};

const isLoading = ref(false);

const columns = [
  {
    key: "sale_date",
    label: "Date & Time",
  },
  {
    key: "payment_method",
    label: "Payed With",
  },
  {
    key: "total_amount",
    label: "Amount",
  },
  {
    key: "actions",
  },
];

const page = ref(1);
const rowCount = 10;

const rows = computed(() => {
  return sales.value.slice((page.value - 1) * rowCount, page.value * rowCount);
});

const actionItems = (row: SaleData) => [
  [
    // {
    //   label: "Edit",
    //   icon: "i-heroicons-pencil-square-20-solid",
    //   click: () => console.log("Edit", row),
    // },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteTransaction(row),
    },
  ],
];

function formatAmount(amount: number) {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
  return formattedAmount;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function chooseIcon(payment_method: string) {
  return payment_method === "Transfer"
    ? "i-solar-transfer-horizontal-linear"
    : "i-heroicons-credit-card";
}

onMounted(async () => {
  await fetchTodaySales();
});

const deleteTransaction = async (sale: SaleData) => {
  isLoading.value = true;
  try {
    await supabase.from("sales").delete().eq("id", sale.sale_id);
    toastSuccess({
      title: "Sale Deleted",
    });
  } catch (error) {
    toastError({
      title: "Sale was not deleted",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
