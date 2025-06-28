import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/db"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
    const navigate = useNavigate()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("")
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
            } catch (error) {
                console.error('Error fetching user:', error)
                setMessage('Failed to load user data')
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [])

    const validatePassword = (password: string) => {
        const errors = []

        if (password.length < 8) {
            errors.push("at least 8 characters")
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("uppercase letter")
        }
        if (!/[a-z]/.test(password)) {
            errors.push("lowercase letter")
        }
        if (!/[0-9]/.test(password)) {
            errors.push("number")
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("special character")
        }

        return errors
    }

    const handlePasswordChange = (field: string, value: string) => {
        setPasswords(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear message when user starts typing
        if (message) setMessage("")
    }

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage("")

        // Validasi input kosong
        if (!passwords.newPassword || !passwords.confirmPassword) {
            setMessage('Please fill in all password fields')
            return
        }

        // Validasi password requirements
        const passwordErrors = validatePassword(passwords.newPassword)
        if (passwordErrors.length > 0) {
            setMessage(`Password must include: ${passwordErrors.join(', ')}`)
            return
        }

        // Validasi password match
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('New passwords do not match')
            return
        }

        setPasswordLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.newPassword
            })

            if (error) {
                setMessage(error.message)
            } else {
                setMessage('Password updated successfully!')
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }
        } catch (error) {
            console.error('Error updating password:', error)
            setMessage('Failed to update password')
        } finally {
            setPasswordLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </div>
        )
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div className="min-h-screen py-16 px-4 pt-24">
            <div className="px-4 space-y-6 sm:px-6">
                <header className="flex space-y-2 justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user?.email} />
                            <AvatarFallback>
                                {(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                            </h1>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGoBack}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Button>
                </header>
                <div className="space-y-8">
                    <Card>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div>Change Password</div>
                            <div>For your security, please do not share your password with others.</div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {message && (
                                <div className={`p-3 rounded-md text-sm ${message.includes('successfully')
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            id="new-password"
                                            value={passwords.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            placeholder="Enter new password"
                                            required
                                            disabled={passwordLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirm-password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm new password"
                                            required
                                            disabled={passwordLoading}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}