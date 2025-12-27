import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  user_id: string
  content_type: 'post' | 'caption' | 'article'
  prompt: string
  generated_content: string
  language: 'en' | 'th'
  created_at: string
}

export interface BannerGeneration {
  id: string
  user_id: string
  prompt: string
  image_url: string
  aspect_ratio: string
  style: string
  created_at: string
}

// Helper functions
export async function signUp(email: string, password: string, fullName: string) {
  // Profile is automatically created by database trigger (handle_new_user)
  // Just sign up the user - trigger will handle profile creation
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function saveGeneration(generation: Omit<Generation, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('generations')
    .insert(generation)
    .select()
    .single()
  
  if (error) throw error
  return data as Generation
}

export async function getGenerations(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as Generation[]
}

export async function deleteGeneration(id: string) {
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Banner Generation functions
export async function saveBannerGeneration(banner: Omit<BannerGeneration, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('banner_generations')
    .insert(banner)
    .select()
    .single()
  
  if (error) throw error
  return data as BannerGeneration
}

export async function getBannerGenerations(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('banner_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data as BannerGeneration[]
}

export async function deleteBannerGeneration(id: string) {
  const { error } = await supabase
    .from('banner_generations')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
