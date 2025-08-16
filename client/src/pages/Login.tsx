import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h1>Login</h1>
      <Button onClick={() => navigate('/home')}>Go to home</Button>
    </div>
  )
}
