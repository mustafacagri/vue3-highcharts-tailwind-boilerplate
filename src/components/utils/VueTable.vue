<script setup>
import { isEmpty } from 'lodash'
import CONSTANTS from '@/CONSTANTS'

const props = defineProps({
  headers: { type: Array, required: true },
  data: { type: Array, required: true },
})
</script>

<template>
  <div class="tableContainer">
    <div
      v-if="isEmpty(data)"
      class="p-4 text-center"
    >
      {{ CONSTANTS?.errors?.noData }}
    </div>
    <table v-else>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.value"
          >
            <span
              v-html="header.text"
              class="block w-full"
              :class="{ [header.align]: header.align }"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in data"
          :key="row.id"
        >
          <td
            v-for="header in headers"
            :key="header.value"
            :class="{ [header.align]: header.align }"
          >
            <slot
              :name="header.value"
              :row
            >
              <span v-html="row[header.value]"></span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.tableContainer {
  border: 1px solid $lightgrey;
  border-radius: 8px;
  overflow: hidden; /* Ensures no gaps between the header and border */
  display: inline-block;
  width: 100%;

  table {
    border-collapse: collapse;
    width: 100%;

    thead {
      th {
        background-color: $lightergrey;
        padding: 10px 24px;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        color: $secondary;
        opacity: 0.5;
        white-space: nowrap; /* Prevents text from breaking */
      }
    }

    tbody {
      tr {
        td {
          border-top: 1px solid $lightgrey;
          padding: 10px 24px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
