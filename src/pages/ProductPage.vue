<template>
    <q-page padding>
        <div class="row justify-end"><q-btn icon="add" flat @click="dialog = true"></q-btn></div>

        <q-dialog v-model="dialog" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">{{ id === 0 ? 'Add New Product' : 'Edit Product' }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form ref="form" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                        <q-input filled v-model="name" label="Your name *" hint="name with Email" lazy-rules
                            :rules="[(val) => (val && val.length > 0) || 'Please type something']" />

                        <q-input filled type="number" v-model="price" label="Your price" lazy-rules
                            :rules="[(val) => (val !== null && val !== '') || 'Please type your price']" />
                        <div class="q-gutter-sm">
                            <q-checkbox v-model="size" label="S" val="S" />
                            <q-checkbox v-model="size" label="M" val="M" />
                            <q-checkbox v-model="size" label="L" val="L" />
                        </div>
                        <div class="q-gutter-sm">
                            <q-checkbox v-model="sweet" label="25" val="25" />
                            <q-checkbox v-model="sweet" label="50" val="50" />
                            <q-checkbox v-model="sweet" label="100" val="100" />
                        </div>
                        <div class="q-gutter-sm">
                            <q-checkbox v-model="sweet" label="H" val="H" />
                            <q-checkbox v-model="sweet" label="C" val="C" />
                            <q-checkbox v-model="sweet" label="F" val="F" />
                        </div>
                    </q-form>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="reset" />
                    <q-btn flat label="Submit" @click="save" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-table :columns="columns" :rows="ProductStore.products">
            <template v-slot:body-cell-operation="{ row }">
                <q-btn flat icon="edit" @click="edit(row)"></q-btn>
                <q-btn flat icon="delete" @click="remove(row)">
                    <template #default></template>
                </q-btn>
            </template>
        </q-table>
    </q-page>
</template>

<script setup lang="ts">
import type { Product } from 'src/models'
import { ref, onMounted } from 'vue'
import { type QForm, type QTableColumn } from 'quasar'
import { useProductStore } from 'src/stores/productStore'
const dialog = ref(false)
const form = ref<QForm | null>(null)
const columns: QTableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        field: 'id',
        align: 'center',
        sortable: true,
    },
    {
        name: 'name',
        label: 'name',
        field: 'name',
        align: 'center',
    },
    {
        name: 'price',
        label: 'price',
        field: 'price',
        align: 'center',
    },
    {
        name: 'size',
        label: 'size',
        field: 'size',
        align: 'center',
    },
    {
        name: 'type',
        label: 'type',
        field: 'type',
        align: 'center',
    },
    {
        name: 'operation',
        label: '',
        field: 'operation',
        align: 'center',
    },
]

const ProductStore = useProductStore()
const id = ref(0)
const name = ref('')
const price = ref(0)
const type = ref<('H' | 'C' | 'F')[]>([])
const size = ref<('S' | 'M' | 'L')[]>([])
const sweet = ref<('25' | '50' | '100')[]>([])
onMounted(async () => {
    await ProductStore.getProducts()
})

function edit(row: Product) {
    id.value = row.id
    name.value = row.name
    price.value = row.price
    dialog.value = true
}

function onSubmit() {
    if (id.value === 0) {
        ProductStore.addProduct({
            id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
            image: ''
        })
    } else {
        ProductStore.updateProduct({
            id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
            image: ''
        })
    }
    dialog.value = false
    onReset()
}
function save() {
    form.value?.validate().then(async (success) => {
        if (success) {
            if (id.value === 0) {
                await ProductStore.addProduct({
                    id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
                    image: ''
                })
            } else {
                await ProductStore.updateProduct({
                    id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
                    image: ''
                })
            }
            dialog.value = false
            onReset()
        }
    })
}
function reset() {
    form.value?.resetValidation()
    id.value = 0
    name.value = ''
    price.value = 0
    dialog.value = false
}
function remove(row: Product) {
    ProductStore.delProduct(row)
}
function onReset() {
    id.value = 0
    name.value = ''
    price.value = 0
    dialog.value = false
}
</script>