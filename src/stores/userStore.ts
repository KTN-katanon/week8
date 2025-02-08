import { defineStore, acceptHMRUpdate } from 'pinia'
import { type User } from 'src/models'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { Loading } from 'quasar'
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])

  async function addUser(u: User) {
    try {
      Loading.show()
      const res = await api.post('/users/',u)
      console.log(res.data)
      await getUsers()
    } catch (err) {
      console.log(err)
    } finally {
      console.log('finally')
      Loading.hide()
    }
  }
  function delUser(u: User) {
    const index = users.value.findIndex((item) => {
      return u.id === item.id
    })
    users.value.splice(index, 1)
  }
  function updateUser(u: User) {
    const index = users.value.findIndex((item) => {
      return u.id === item.id
    })
    users.value[index] = { ...u }
  }
  function getUserByEmail(login: string): User | undefined {
    return users.value.find((item) => item.login === login)
  }

  async function getUsers() {
    try {
      Loading.show()
      const res = await api.get('/users/')
      console.log(res.data)
      users.value = res.data
    } catch (err) {
      console.log(err)
    } finally {
      console.log('finally')
      Loading.hide()
    }
  }

  return { users, addUser, delUser, updateUser, getUserByEmail, getUsers }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
