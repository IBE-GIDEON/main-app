import React, { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'

export default function ZenOSAuthPage() {
  const [mode, setMode] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [validLength, setValidLength] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSymbol, setHasSymbol] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [strengthScore, setStrengthScore] = useState(0)

  useEffect(() => {
    const length = password.length >= 8
    const number = /[0-9]/.test(password)
    const symbol = /[^A-Za-z0-9]/.test(password)
    setValidLength(length)
    setHasNumber(number)
    setHasSymbol(symbol)
    let score = 0
    if (length) score++
    if (number) score++
    if (symbol) score++
    if (password.length >= 12) score++
    setStrengthScore(score)
    if (mode === 'signup') setPasswordsMatch(password === confirm)
  }, [password, confirm, mode])

  const attemptCredentialSignIn = async (creds) => {
    try {
      const res = await signIn('credentials', { redirect: false, ...creds })
      if (!res) return { ok: true }
      return res
    } catch (err) {
      console.error('[ZenOS] signIn threw error:', err)
      return { error: err?.message || 'An unexpected error occurred during sign in (CLIENT_FETCH_ERROR).' }
    }
  }

 const handleSocialSignIn = async (provider) => {
    setLoading(true) 
    try { await signIn(provider, { callbackUrl: '/' }) } catch (err) { console.error(err); alert('Social sign-in failed.') }
    finally { setLoading(false) }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await attemptCredentialSignIn({ email, password, remember })
    setLoading(false)
    if (res?.error) { alert(res.error.includes('CLIENT_FETCH_ERROR') ? 'Sign-in failed: server unreachable.' : res.error); return }
    window.location.href = '/'
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!validLength || !hasNumber || !hasSymbol) { alert('Password requirements not met'); return }
    if (!passwordsMatch) { alert('Passwords do not match'); return }
    setLoading(true)
    try {
      const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      let data
      try { data = await r.json() } catch { const text = await r.text(); data = { message: text } }
      if (!r.ok) throw new Error(data?.message || 'Registration failed')
      const signInRes = await attemptCredentialSignIn({ email, password })
      if (signInRes?.error) { alert('Account created, sign-in failed. Please login manually.'); setMode('signin'); setLoading(false); return }
      window.location.href = '/'
    } catch (err) { alert(err.message || 'Registration error') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ZenOS Logo" className="w-16 h-16" />
        </div>

        {mode === 'signin' ? (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">WELCOME BACK</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your ZenOS account</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">CREATE YOUR ZENOS ACCOUNT</h2>
            <p className="text-sm text-gray-500 mt-1">Enjoy your AI-powered lifestyle</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => handleSocialSignIn('google')} className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2 px-3 hover:shadow-md transition shadow-sm bg-white" disabled={loading} aria-label="Sign in with Google">
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700">Continue with Google</span>
          </button>
          <button onClick={() => handleSocialSignIn('apple')} className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2 px-3 hover:shadow-md transition shadow-sm bg-white" disabled={loading} aria-label="Sign in with Apple">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path d="M16.365 1.43c-.7.82-1.35 2.07-.98 3.3.96 3.12 3.1 4.18 3.32 4.26-.03.13-.5 1.83-1.8 3.3-1.11 1.26-2.03 1.96-3.12 1.96-1.01 0-1.57-.6-2.94-.6-1.35 0-1.92.6-2.94.6-1.09 0-2.01-.7-3.12-1.96C1.7 11 .9 6.98 3 4.77 4.2 2.6 6.6 2 7.52 1.92c1.05-.1 2.39.73 3.12.73.74 0 2.15-.92 3.73-.22z" />
            </svg>
            <span className="text-sm text-gray-700">Continue with Apple</span>
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-gray-300" />
          <div className="text-xs text-gray-400">or</div>
          <div className="flex-1 h-[1px] bg-gray-300" />
        </div>

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
          <label className="block">
            <div className="text-sm mb-1 text-gray-700">Email</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="you@company.com" />
          </label>

          <label className="block">
            <div className="flex items-center justify-between text-sm mb-1 text-gray-700">
              <span>Password</span>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Your password" aria-describedby="pw-requirements" />
            {mode === 'signup' && (
              <div className="mt-2 text-xs text-gray-500">
                <ul className="list-disc ml-5">
                  <li className={validLength ? 'text-green-600' : 'text-red-500'}>At least 8 characters</li>
                  <li className={hasNumber ? 'text-green-600' : 'text-red-500'}>Contains a number</li>
                  <li className={hasSymbol ? 'text-green-600' : 'text-red-500'}>Contains a symbol</li>
                </ul>
              </div>
            )}
          </label>

          {mode === 'signup' && (
            <label className="block">
              <div className="text-sm mb-1 text-gray-700">Confirm password</div>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${confirm && !passwordsMatch ? 'border-red-500' : ''}`} placeholder="Confirm password" />
              {!passwordsMatch && <div className="text-xs text-red-500 mt-1">Passwords do not match</div>}
            </label>
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-sky-600 hover:underline">Forgot password?</a>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="flex-1 bg-sky-600 text-white py-2 rounded-xl disabled:opacity-50 shadow-md hover:bg-sky-700 transition">{loading ? 'Working...' : (mode === 'signin' ? 'Sign in' : 'Create account')}</button>
          </div>
        </form>

        <div className="mt-4 text-sm text-center text-gray-500">
          {mode === 'signin' ? (
            <>Don’t have an account? <button onClick={() => setMode('signup')} className="text-sky-600 hover:underline">Create account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode('signin')} className="text-sky-600 hover:underline">Sign in</button></>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">By continuing you agree to ZenOS Terms of Service.</div>
      </div>
    </div>
  )
}
