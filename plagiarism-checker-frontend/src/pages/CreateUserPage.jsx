import MainLayout from '../layouts/MainLayout'
import { useState } from 'react'
import api from '../api/api'

const CreateUserPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('assistant') // default role
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await api.post('/users/create', {
                username,
                email,
                password,
                role,
            })
            setMessage(`Akun ${username} berhasil dibuat`)
            setUsername('')
            setEmail('')
            setPassword('')
            setRole('assistant')
        } catch (err) {
            console.error("Upload error:", err);
            setMessage('Gagal membuat akun')
        }
    }

    return (
        <MainLayout>
            <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Buat Akun Asisten</h2>
                {message && <p className="mb-2 text-blue-600">{message}</p>}
                <form onSubmit={handleCreate} className="space-y-4">
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <select
                        className="w-full p-2 border rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="assistant">Asisten</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                    >
                    Buat Akun
                    </button>
                </form>
            </div>
        </MainLayout>
    )
}

export default CreateUserPage
