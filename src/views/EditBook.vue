<template>
    <v-container class="fill-height">
        <v-responsive class="align-center text-center fill-height">
            <BookForm :id="id"></BookForm>
        </v-responsive>
    </v-container>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import BookForm from '@/components/BookForm.vue';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const id = ref(0);

// Get id from route
if (route.params.id && typeof route.params.id === 'string') {
    const paramId = parseInt(route.params.id) || 0;
    if (isNaN(paramId) || paramId <= 0) {
        router.push({ name: 'Home' });
    } else {
        id.value = paramId;
    }
}

</script>