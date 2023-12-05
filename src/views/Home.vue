<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- Dialog to delete -->
      <v-dialog v-model="dialogDelete">
        <v-card title="Eliminar libro">
          <v-card-text>¿Seguro que quieres borrar este libro?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="closeDelete">Cancelar</v-btn>
            <v-btn variant="outlined" color="error" @click="deleteItemConfirm">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="text-body-2 font-weight-light mb-4">CRUD</div>
      <h1 class="text-h2 font-weight-bold mb-5">Librería</h1>

      <!-- Alert -->
      <v-alert v-if="alert" :type="typeSuccess ? 'success' : 'error'" variant="tonal" class="mt-4 mb-4"
        :location="'right bottom'">
        {{ alert }}
      </v-alert>

      <!-- Table -->
      <v-data-table :headers="headers" :items="books" :search="search" :filter-keys="['title', 'author']"
      items-per-page-text="Libros por página" page-text="{0}-{1} de {2}">
        <!-- Search and Add -->
        <template v-slot:top>
          <v-row class="mb-4">
            <v-col cols="12" sm="8">
              <v-text-field v-model="search" label="Buscar" class="mx-4" variant="filled" flat></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-btn color="secondary" class="mx-4" block size="large" @click="addBook">
                <v-icon icon="mdi-plus"></v-icon>
                Agregar
              </v-btn>
            </v-col>
          </v-row>

        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-switch v-model="item.status" :label="item.status ? 'Rentado' : 'Disponible'" color="primary"
            @update:model-value="editItem(item)"></v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon size="small" class="me-2" @click="openEditItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)">
            mdi-delete
          </v-icon>

        </template>
      </v-data-table>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>

import { useBooksStore } from '@/store/books';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { IBook } from '@/interfaces';
import { useRouter } from 'vue-router';
const booksStore = useBooksStore()

const headers = [
  {
    title: 'Titulo',
    key: 'title',
    sortable: true,
    filterable: true
  },
  {
    title: 'Autor',
    key: 'author',
    sortable: true,
    filterable: true
  },
  {
    title: 'Año',
    key: 'year',
    sortable: true
  },
  {
    title: 'ISBN',
    key: 'isbn',
    sortable: true
  },
  {
    title: 'Disponibilidad',
    key: 'status',
    sortable: true
  },
  {
    title: 'Acciones',
    key: 'actions',
    sortable: false
  }
]

const totalItems = ref(0)
const books = ref<IBook[]>([])
const loading = ref(false)
const search = ref('')
const alert = ref('')
const typeSuccess = ref(true)

const dialogDelete = ref(false)
const itemToDelete = ref(0)

const router = useRouter()


const loadItems = async () => {
  alert.value = ''
  loading.value = true
  await booksStore.getItems()
  books.value = booksStore.rows
  totalItems.value = booksStore.totalRows
  loading.value = false
}

const addBook = () => {
  // Redirect to router AddBook
  router.push({ name: 'AddBook' })
}

const editItem = async (item: IBook) => {
  alert.value = ''
  await booksStore.updateItem(item)
  typeSuccess.value = true
  alert.value = 'Libro actualizado'
}

const openEditItem = (item: IBook) => {
  router.push({ name: 'EditBook', params: { id: item.id } })
}

const deleteItem = async (item: IBook) => {
  dialogDelete.value = true
  itemToDelete.value = item.id || 0
}

const deleteItemConfirm = async () => {
  if (itemToDelete.value) {
    await booksStore.deleteItem(itemToDelete.value)
    await loadItems()
    closeDelete()
    typeSuccess.value = false
    alert.value = 'Libro eliminado'
  }
}

const closeDelete = () => {
  dialogDelete.value = false
  itemToDelete.value = 0
}

onMounted(async () => {
  await loadItems()
})
</script>
