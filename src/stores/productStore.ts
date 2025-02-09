import { defineStore, acceptHMRUpdate } from 'pinia'
import { type Product } from 'src/models'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { Loading, Notify } from 'quasar'
export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([])
    async function addProduct(u: Product) {
        try {
            Loading.show()
            const res = await api.post('/products', u)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.log(err)
            Notify.create({
                message: 'Add failed',
                color: 'negative',
                position: 'top',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    async function delProduct(u: Product) {
        try {
            Loading.show()
            const res = await api.delete('/products/' + u.id)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.log(err)
            Notify.create({
                message: 'Delete failed',
                color: 'negative',
                position: 'top',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    async function updateProduct(u: Product) {
        try {
            Loading.show()
            const res = await api.patch('/products/' + u.id, u)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.log(err)
            Notify.create({
                message: 'Update failed',
                color: 'negative',
                position: 'top',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    async function getProducts() {
        try {
            Loading.show()
            const res = await api.get('/products')
            console.log(res.data)
            products.value = res.data
        } catch (err) {
            console.log(err)
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }

    return { products, addProduct, delProduct, updateProduct, getProducts }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
