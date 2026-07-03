import { Toaster } from 'react-hot-toast'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#0f2860', color: '#fff', borderRadius: '12px' } }} />
    </>
  )
}
