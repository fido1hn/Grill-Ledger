<template>
  <div class="pos-container">
    <h1>Takeout POS</h1>

    <!-- Menu Items -->
    <div class="menu-items">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="addToOrder(item)"
      >
        {{ item.name }} - ${{ item.price.toFixed(2) }}
      </button>
    </div>

    <!-- Current Order -->
    <div class="current-order">
      <h2>Current Order</h2>
      <div v-for="(pack, packIndex) in currentOrder.packs" :key="packIndex">
        <h3>Pack {{ packIndex + 1 }}</h3>
        <ul>
          <li v-for="(item, itemIndex) in pack.items" :key="itemIndex">
            {{ item.name }} - ${{ item.price.toFixed(2) }}
            <button @click="removeFromPack(packIndex, itemIndex)">
              Remove
            </button>
          </li>
        </ul>
      </div>
      <h3>Additional Items</h3>
      <ul>
        <li v-for="(item, index) in currentOrder.additionalItems" :key="index">
          {{ item.name }} - ${{ item.price.toFixed(2) }}
          <button @click="removeAdditionalItem(index)">Remove</button>
        </li>
      </ul>
      <p>Total Packs: {{ currentOrder.packs.length }}</p>
      <p>Total: ${{ totalAmount.toFixed(2) }}</p>
    </div>

    <!-- Checkout Button -->
    <button @click="checkout" :disabled="!hasItems">Checkout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { name: "Rice", price: 5.0, requiresPack: true },
        { name: "Spaghetti", price: 6.0, requiresPack: true },
        { name: "Chicken", price: 7.0 },
        { name: "Meat", price: 8.0 },
        { name: "Egg", price: 2.0 },
        { name: "Others", price: 4.0 },
      ],
      currentOrder: {
        packs: [],
        additionalItems: [],
      },
      packPrice: 0.5,
    };
  },
  computed: {
    totalAmount() {
      const packTotal = this.currentOrder.packs.reduce((total, pack) => {
        return (
          total +
          pack.items.reduce((packTotal, item) => packTotal + item.price, 0)
        );
      }, 0);
      const additionalTotal = this.currentOrder.additionalItems.reduce(
        (total, item) => total + item.price,
        0,
      );
      const packsCost = this.currentOrder.packs.length * this.packPrice;
      return packTotal + additionalTotal + packsCost;
    },
    hasItems() {
      return (
        this.currentOrder.packs.length > 0 ||
        this.currentOrder.additionalItems.length > 0
      );
    },
  },
  methods: {
    addToOrder(item) {
      if (item.requiresPack) {
        // If the last pack is full (already has a pack item), create a new pack
        if (
          this.currentOrder.packs.length === 0 ||
          this.currentOrder.packs[
            this.currentOrder.packs.length - 1
          ].items.some((i) => i.requiresPack)
        ) {
          this.currentOrder.packs.push({ items: [] });
        }
        // Add the item to the last pack
        this.currentOrder.packs[this.currentOrder.packs.length - 1].items.push({
          ...item,
        });
      } else {
        // Add non-pack items to additional items
        this.currentOrder.additionalItems.push({ ...item });
      }
    },
    removeFromPack(packIndex, itemIndex) {
      this.currentOrder.packs[packIndex].items.splice(itemIndex, 1);
      // If the pack is empty after removal, remove the pack
      if (this.currentOrder.packs[packIndex].items.length === 0) {
        this.currentOrder.packs.splice(packIndex, 1);
      }
    },
    removeAdditionalItem(index) {
      this.currentOrder.additionalItems.splice(index, 1);
    },
    checkout() {
      // Implement checkout logic here
      const packCount = this.currentOrder.packs.length;
      const itemCount =
        this.currentOrder.packs.reduce(
          (total, pack) => total + pack.items.length,
          0,
        ) + this.currentOrder.additionalItems.length;
      alert(
        `Order completed!\nTotal Packs: ${packCount}\nTotal Items: ${itemCount}\nTotal Amount: $${this.totalAmount.toFixed(2)}`,
      );
      this.currentOrder = { packs: [], additionalItems: [] };
    },
  },
};
</script>

<style scoped>
.pos-container {
  max-width: 100%;
  padding: 10px;
  font-family: Arial, sans-serif;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.menu-items button {
  padding: 10px;
  font-size: 16px;
}

.current-order {
  margin-bottom: 20px;
}

.current-order ul {
  list-style-type: none;
  padding: 0;
}

.current-order li {
  margin-bottom: 5px;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
