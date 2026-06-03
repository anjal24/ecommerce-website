import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { dummyUser } from '@/assets/assets'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, PROFILE_MENU } from '@/constants'
import { useAuth, useClerk } from '@clerk/clerk-expo' // 1. Imported useAuth hook from Clerk

export default function Profile() {
  // Destructure the native signOut action from Clerk's auth hook
   
  
  // Note: For production, replace dummyUser with Clerk's actual useUser() hook data means instead of using dummy data we are using clerk
  const { user, signOut } = useClerk()
  const router = useRouter()

  // 2. Updated async logout handler to clear user session safely
  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in")
      
  }

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={["top"]}>
      <Header title='Profile'/>
      <ScrollView className='flex-1 px-4' contentContainerStyle={!user ? { flex: 1, justifyContent: "center" , alignItems: "center" } : { paddingTop: 16 }}>
        {!user ? (
          /* --- Guest User Placeholder View --- */
          <View className='items-center w-full'>
            <View className='w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-6'>
              <Ionicons name='person' size={40} color={COLORS.secondary}/>
            </View>
            <Text className='text-primary font-bold text-xl mb-2'>Guest User</Text>
            <Text className='text-secondary text-base mb-4'>Log in to view your profile, orders, and addresses.</Text>
            <TouchableOpacity  
              onPress={() => router.push('/sign-in')}
              className='bg-primary w-3/5 py-3 rounded-full items-center shadow-lg'>
              <Text className="text-white font-semibold">Login / Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* --- Authenticated Profile Banner Info --- */}
            <View className='items-center mb-8'>
              <View className='mb-3'>
                <Image source={{ uri: user.imageUrl }} className='w-20 h-20 border-2 border-white shadow-sm rounded-full'/>
              </View>
              <Text className='text-xl font-bold text-primary'>
                {user.firstName + " " + user.lastName}
              </Text>
              <Text className='text-secondary text-sm'>{user.emailAddresses[0].emailAddress}</Text>

              {/* Conditionally Render Admin Panel Trigger Link */}
              {user.publicMetadata?.role === 'admin' && (
                <TouchableOpacity onPress={() => router.push('/admin')} className='mt-4 bg-primary px-6 py-2 rounded-full'>
                  <Text className='text-white'>Admin panel</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* --- Secondary Profile Utility Navigation Links Menu --- */}
            <View className='bg-white rounded-xl border border-gray-100/75 p-2 mb-4' >
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity key={item.id} className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`} onPress={() => router.push(item.route as any)}>
                  <View className='w-10 h-10 bg-surface rounded-full items-center justify-center mr-4'>
                    <Ionicons name={item.icon as any} size={20} color={COLORS.primary}/>
                  </View>
                  <Text className='flex-1 text-primary font-medium'>{item.title}</Text>
                  <Ionicons name='chevron-forward' size={20} color={COLORS.primary}/>
                </TouchableOpacity>
              ))}
            </View> 

            {/* --- Fixed Functional Logout Dispatcher Button --- */}
            <TouchableOpacity className='flex-row items-center justify-center p-4 mb-10' onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text className='text-red-500 font-bold ml-2'>Log Out</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}