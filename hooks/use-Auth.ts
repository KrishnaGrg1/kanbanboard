import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth.store'
import { toast } from 'sonner'

type LoginInput = {
  email: string
  password: string
}

export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: LoginInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('No user returned')

      return data.user
    },

    onSuccess: (user) => {
      setUser({
        id: user.id,
        email: user.email!,
      })

      router.push('/dashboard')
    },
  })
}


export function useRegister() {
  // const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: LoginInput) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('No user returned')

      return data
    },

    onSuccess: () => {
  toast.success("Successfully register ")

      // router.push('/login')
    },
  })
}
