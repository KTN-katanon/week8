<template>
    <q-page padding>
        <div class="row justify-end"><q-btn icon="add" flat @click="dialog = true"></q-btn></div>

        <q-dialog v-model="dialog" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">{{ id === 0 ? 'Add New Product' : 'Edit Product' }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-form ref="form" class="q-gutter-md">
                        <q-input filled v-model="name" label="Product Name *" hint="Product Name" lazy-rules
                            :rules="[(val) => (val && val.length > 0) || 'Please type product name']" />

                        <q-input filled v-model.number="price" label="Your price" lazy-rules
                            :rules="[(val) => (val !== null && val !== '') || 'Please type your price']" />


                        <q-select filled v-model="size" :options="['S', 'M', 'L']" label="Size Product" />
                        <q-select filled v-model="sweet" :options="['25', '50', '100']" label="Sweet Level Product" />
                        <q-select filled v-model="type" :options="['H', 'C', 'F']" label="Type Product" />

                        <q-file filled v-model="imageFile" label="Upload Image" accept="image/*"
                            @update:model-value="onFileChange" />

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
                <q-btn flat icon="delete" @click="remove(row)"></q-btn>
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
const price = ref<number>(0)
const type = ref<'H' | 'C' | 'F'>()
const size = ref<'S' | 'M' | 'L'>('S')
const sweet = ref<'25' | '50' | '100'>()
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
onMounted(() => {
    setTimeout(async () => {
        await ProductStore.getProducts()
    }, 0) // ให้ Vue โหลดเสร็จก่อนค่อย fetch ข้อมูล
})

function edit(row: Product) {
    id.value = row.id
    name.value = row.name
    price.value = row.price
    imagePreview.value = row.image || null
    dialog.value = true
}

function onFileChange(file: File | null) {
    if (file) {
        imageFile.value = file
        imagePreview.value = URL.createObjectURL(file)
    } else {
        imageFile.value = null
        imagePreview.value = null
    }
}
// function onSubmit() {
//     if (id.value === 0) {
//         ProductStore.addProduct({
//             id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
//             image: ''
//         })
//     } else {
//         ProductStore.updateProduct({
//             id: id.value, name: name.value, size: size.value, sweet: sweet.value, type: type.value, price: price.value,
//             image: ''
//         })
//     }
//     dialog.value = false
//     onReset()
// }
async function save() {
    const success = await form.value?.validate()
    if (success) {
        const imageUrl = imageFile.value ? await uploadImage(imageFile.value) : imagePreview.value || ''

        if (id.value === 0) {
            await ProductStore.addProduct({ id: id.value, name: name.value, size: size.value, sweet: sweet.value || '25', type: type.value || 'H', price: price.value, image: imageUrl })
        } else {
            await ProductStore.updateProduct({ id: id.value, name: name.value, size: size.value, sweet: sweet.value || '25', type: type.value || 'H', price: price.value, image: imageUrl })
        }

        dialog.value = false
        onReset()
    }
}
function reset() {
    form.value?.resetValidation();
    id.value = 0;
    name.value = '';
    price.value = 0;
    imageFile.value = null;
    imagePreview.value = null;
    dialog.value = false;
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

async function uploadImage(file: File): Promise<string> {
    // แทนที่ด้วย API อัปโหลดจริง เช่น Firebase, Supabase หรือเซิร์ฟเวอร์ของคุณ
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('https://your-upload-api.com/upload', {
        method: 'POST',
        body: formData,
    })

    const data = await response.json()
    return data.url // API ต้องคืนค่า URL ของรูปภาพที่อัปโหลด
}
</script>