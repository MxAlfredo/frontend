<template>
    <!-- Title to add or edit -->
    <v-card-title>
        <span class="text-h5">{{ id ? 'Editar' : 'Agregar' }} Libro</span>
    </v-card-title>

    <v-form @submit.prevent="addBook" v-model="valid">
        <!-- Fields -->
        <v-container>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model.trim="book.title" :rules="[rules.required]" label="Titulo"
                        required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model.trim="book.author" :rules="[rules.required, rules.name]" label="Autor"
                        required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field v-model.trim="book.year" :rules="[rules.required, rules.maxYear, rules.maxCurrentYear]"
                        label="Año" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-text-field v-model.trim="book.isbn" :rules="[rules.required, rules.isbn]" label="ISBN"
                        required></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-switch v-model="book.status" :label="book.status ? 'Rentado' : 'Disponible'"
                        color="primary"></v-switch>
                </v-col>
            </v-row>

            <v-row class="mt-4">
                <v-col cols="12" sm="6">
                    <v-btn block @click="returnHome">
                        Cancelar
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-btn color="primary" block type="submit" v-if="id">
                        Editar
                    </v-btn>
                    <v-btn color="primary" block type="submit" v-else>
                        Agregar
                    </v-btn>
                </v-col>
            </v-row>

        </v-container>
    </v-form>
</template>

<script lang="ts" setup>
import { IBook } from '@/interfaces';
import { useBooksStore } from '@/store/books';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Props
const props = defineProps({
    id: {
        type: Number,
        default: 0
    }
})

// Add rule to max year only numbers and max current year
const rules = {
    required: (value: string) => !!value || 'Campo Requerido',
    name: (value: string) => /^[a-zA-Z\u00C0-\u017F\s]+$/.test(value) || 'Solo letras y espacios',
    maxYear: (value: string) => /^[0-9]+$/.test(value) || 'El año debe ser un numero',
    maxCurrentYear: (value: string) => parseInt(value) <= new Date().getFullYear() || 'El año no puede ser mayor al actual',
    isbn: (value: string) => /^[0-9-]+$/.test(value) || 'Solo numeros y guiones'
}

const booksStore = useBooksStore()
const router = useRouter();
const valid = ref(false)
const book = ref<IBook>({
    id: 0,
    title: '',
    author: '',
    year: 0,
    isbn: '',
    status: false
})

const addSubmit = ref(true)



const addBook = async () => {
    if (valid.value) {
        if (addSubmit.value) {
            await booksStore.addBook(book.value)
            router.push({ name: 'Home' })
        } else {
            await booksStore.updateItem(book.value)
            router.push({ name: 'Home' })
        }
    }
}

const returnHome = () => {
    router.push({ name: 'Home' })
}


onMounted(async () => {
    if (props.id) {
        addSubmit.value = false
        book.value = await booksStore.getBookById(props.id)
    }
})
</script>