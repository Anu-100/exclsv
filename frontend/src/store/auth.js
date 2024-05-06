import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

const userAuthStore = create(persist((set, get) => ({
    allUserData: null,
    loading: false,
    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),
    
    setUser: (user) => set({allUserData: user}),
    setLoading: (loading) => set({ loading }),
    isLoggedIn:  () => get().allUserData !== null,
}),{
    name: 'userAuthStore',
    getStorage: ()=>localStorage
}))

if(import.meta.env.DEV){
    mountStoreDevtool('Store', userAuthStore)
}

export { userAuthStore }

