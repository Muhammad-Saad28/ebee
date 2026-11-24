import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { AdminLoginForm } from './AdminLoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated()
  if (authenticated) {
    redirect('/admin')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#247BFF]/15 blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.05] blur-[120px] pointer-events-none" />
      
      <AdminLoginForm />
    </div>
  )
}
