import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    weight: '',
    sex: '',
    activityLevel: '',
    height: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    // TODO: integrar com backend de registro
    navigate('/dashboard')
  }

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentario', desc: 'Pouco ou nenhum exercicio' },
    { value: 'light', label: 'Leve', desc: 'Exercicio leve 1-3 dias/semana' },
    { value: 'moderate', label: 'Moderado', desc: 'Exercicio moderado 3-5 dias/semana' },
    { value: 'active', label: 'Ativo', desc: 'Exercicio pesado 6-7 dias/semana' },
    { value: 'very_active', label: 'Muito Ativo', desc: 'Exercicio muito pesado, trabalho fisico' },
  ]

  return (
    <div className="register-page">
      <div className="register-bg-shapes">
        <div className="bg-shape bg-shape-1" />
        <div className="bg-shape bg-shape-2" />
        <div className="bg-shape bg-shape-3" />
      </div>

      <div className="register-container">
        <div className="register-header">
          <Link to="/login" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar ao login
          </Link>

          <div className="register-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>
            <span>Crie</span> sua conta
          </h1>
          <p>Comece sua jornada hacia uma vida mais saudavel</p>
        </div>

        {/* Progress indicator */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="progress-step-number">1</div>
            <span>Dados basicos</span>
          </div>
          <div className="progress-connector" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="progress-step-number">2</div>
            <span>Corpo e atividade</span>
          </div>
        </div>

        <div className="register-card">
          {step === 1 && (
            <form onSubmit={handleNext} className="register-form">
              <div className="form-group">
                <label htmlFor="fullName">Nome Completo</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 13 2 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimo 8 caracteres"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita a senha"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-register-next">
                Proximo passo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Peso (kg)</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3v18M5 8l7-5 7 5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="70"
                      min="30"
                      max="300"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="height">Altura (cm)</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="170"
                      min="100"
                      max="250"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Sexo</label>
                <div className="radio-group">
                  <label className={`radio-card ${formData.sex === 'male' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      checked={formData.sex === 'male'}
                      onChange={handleChange}
                      hidden
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="10" cy="14" r="5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 5l-5.5 5.5M19 5h-5M19 5v5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Masculino</span>
                  </label>
                  <label className={`radio-card ${formData.sex === 'female' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      checked={formData.sex === 'female'}
                      onChange={handleChange}
                      hidden
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13v9M9 18h6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Feminino</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Nivel de atividade fisica</label>
                <div className="activity-levels">
                  {activityLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`activity-card ${formData.activityLevel === level.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={formData.activityLevel === level.value}
                        onChange={handleChange}
                        hidden
                      />
                      <div className="activity-card-content">
                        <span className="activity-label">{level.label}</span>
                        <span className="activity-desc">{level.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="register-actions">
                <button type="button" className="btn-register-back" onClick={() => setStep(1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Voltar
                </button>
                <button type="submit" className="btn-register-submit">
                  Criar conta
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="register-footer">
          Ja tem uma conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  )
}
