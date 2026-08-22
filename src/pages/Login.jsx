import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCookie } from '@/lib/cookie'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card'
import { toast } from "sonner"

import clicknextLogo from '@/assets/icons/clicknext-logo.png'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ValidateEmail = (email) => {
  return EMAIL_REGEX.test(email)
}

const ValidatePassword = (password) => {
  return password.length > 3
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    const nextErrors = {}
    if (!ValidateEmail(email)) {
      nextErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }
    if (!ValidatePassword(password)) {
      nextErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error('เข้าสู่ระบบไม่สำเร็จ', {
        description: nextErrors.email || nextErrors.password,
      })
      return
    }

    setCookie('email', email)
    toast.success('เข้าสู่ระบบสำเร็จ', {
      description: email,
    })

    navigate('/deposit-withdraw', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-1">
          <img src={clicknextLogo} alt="ClickNext Logo" className="h-12 w-auto" />
          <CardDescription>เข้าสู่ระบบเพื่อใช้งาน</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              variant={email && password ? 'default' : 'outline'}
              className="w-full cursor-pointer"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
