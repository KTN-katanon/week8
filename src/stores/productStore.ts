import { defineStore, acceptHMRUpdate } from 'pinia'
import { Loading, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { type Product } from 'src/models'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
    const products = ref<Product[]>([])

    async function addProduct(p: Product) {
        try {
            Loading.show()
            const res = await api.post('/products', p)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.error(err)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Loading failed',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    async function delProduct(p: Product) {
        try {
            Loading.show()
            const res = await api.delete('/products/' + p.id)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.error(err)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Delete failed',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    async function updateProduct(p: Product) {
        try {
            Loading.show()
            const res = await api.patch('/products/' + p.id, p)
            console.log(res.data)
            await getProducts()
        } catch (err) {
            console.error(err)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Update failed',
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
            console.error(err)
            Notify.create({
                color: 'negative',
                position: 'top',
                message: 'Loading products failed',
                icon: 'report_problem',
            })
        } finally {
            console.log('finally')
            Loading.hide()
        }
    }
    getProducts()
    return { products, addProduct, delProduct, updateProduct, getProducts }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
