import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
