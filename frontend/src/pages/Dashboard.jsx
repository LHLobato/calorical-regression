import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const tips = [
  'Uma refeicao colorida geralmente e mais nutritiva',
  'Beber agua antes das refeicoes ajuda na digestao',
  'Mastigar devagar melhora a absorcao de nutrientes',
  'Fibras sao essenciais para uma boa saude intestinal',
  'Proteinas em todas as refeicoes ajudam na saciedade',
]

// Dados simulados do usuario
const userData = {
  name: 'Usuario',
  dailyCalorieGoal: 2200,
  macros: {
    protein: { current: 95, goal: 140, unit: 'g', label: 'Proteinas' },
    carbs: { current: 210, goal: 280, unit: 'g', label: 'Carboidratos' },
    fat: { current: 52, goal: 73, unit: 'g', label: 'Gorduras' },
    fiber: { current: 22, goal: 30, unit: 'g', label: 'Fibras' },
    water: { current: 1800, goal: 2500, unit: 'ml', label: 'Agua' },
  }
}

// SVG donut chart component
function DonutChart({ current, goal, size = 180 }) {
  const percentage = Math.min((current / goal) * 100, 100)
  const radius = 70
  const strokeWidth = 14
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} viewBox="0 0 180 180">
      {/* Background circle */}
      <circle
        cx="90"
        cy="90"
        r={normalizedRadius}
        fill="transparent"
        stroke="#e8f0e8"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx="90"
        cy="90"
        r={normalizedRadius}
        fill="transparent"
        stroke="url(#greenGradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        className="donut-progress"
      />
      {/* Inner shadow circle */}
      <circle
        cx="90"
        cy="90"
        r={normalizedRadius - strokeWidth}
        fill="var(--surface)"
        className="donut-inner"
      />
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ec96e" />
          <stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualMeal, setManualMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  const totalCalories = userData.macros.protein.current * 4 + userData.macros.carbs.current * 4 + userData.macros.fat.current * 9

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
    setResult(null)
  }, [])

  const handleUpload = useCallback(async () => {
    if (!image) return

    setLoading(true)

    setTimeout(() => {
      setResult({
        itens: [
          { nome: 'Arroz', peso_gramas: 150, calorias_kcal: 192, proteinas_g: 3.8, carboidratos_g: 42.2, gorduras_g: 0.3, fibras_g: 2.4 },
          { nome: 'Feijao', peso_gramas: 130, calorias_kcal: 100, proteinas_g: 5.9, carboidratos_g: 18.2, gorduras_g: 0.7, fibras_g: 10.8 },
          { nome: 'Frango grelhado', peso_gramas: 120, calorias_kcal: 191, proteinas_g: 33.6, carboidratos_g: 0, gorduras_g: 6.0, fibras_g: 0 },
        ],
        totais: {
          calorias_kcal: 483,
          proteinas_g: 43.3,
          carboidratos_g: 60.4,
          gorduras_g: 7.0,
          fibras_g: 13.2,
        }
      })
      setLoading(false)
    }, 1500)
  }, [image])

  const handleManualSubmit = (e) => {
    e.preventDefault()
    // TODO: integrar com backend
    setManualMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    setShowManualEntry(false)
  }

  const handleClear = useCallback(() => {
    setImage(null)
    setPreview(null)
    setDescription('')
    setResult(null)
  }, [])

  const maxProtein = userData.macros.protein.goal
  const maxCarbs = userData.macros.carbs.goal
  const maxFat = userData.macros.fat.goal
  const maxFiber = userData.macros.fiber.goal

  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <nav className="dash-nav">
        <div className="dash-nav-brand">
          <div className="dash-nav-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round"/>
            </svg>
          </div>
          <span><span>Caloric</span> Regression</span>
        </div>
        <div className="dash-nav-actions">
          <button className="nav-btn" title="Notificacoes">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="nav-avatar" onClick={() => navigate('/login')}>
            {userData.name.charAt(0)}
          </button>
        </div>
      </nav>

      <main className="dash-main">
        {/* Calorie Overview */}
        <section className="calorie-overview">
          <div className="calorie-greeting">
            <h2>Ola, {userData.name}! 👋</h2>
            <p>Veja como esta sua nutricao hoje</p>
          </div>

          <div className="calorie-chart-card">
            <div className="chart-container">
              <DonutChart current={totalCalories} goal={userData.dailyCalorieGoal} />
              <div className="chart-center-text">
                <span className="chart-cal-number">{totalCalories}</span>
                <span className="chart-cal-label">kcal</span>
              </div>
            </div>
            <div className="chart-info">
              <div className="chart-goal">
                <span>Meta diaria</span>
                <strong>{userData.dailyCalorieGoal} kcal</strong>
              </div>
              <div className="chart-remaining">
                <span>Restante</span>
                <strong>{Math.max(userData.dailyCalorieGoal - totalCalories, 0)} kcal</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Macros Stats */}
        <section className="macros-overview">
          <h3>Macronutrientes do dia</h3>
          <div className="macros-grid">
            <div className="macro-stat">
              <div className="macro-stat-icon protein">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="macro-stat-info">
                <span className="macro-stat-value">{userData.macros.protein.current}g</span>
                <span className="macro-stat-label">{userData.macros.protein.label}</span>
                <div className="macro-mini-bar">
                  <div
                    className="macro-mini-bar-fill protein"
                    style={{ width: `${(userData.macros.protein.current / userData.macros.protein.goal) * 100}%` }}
                  />
                </div>
                <span className="macro-stat-goal">/ {userData.macros.protein.goal}g</span>
              </div>
            </div>

            <div className="macro-stat">
              <div className="macro-stat-icon carbs">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="macro-stat-info">
                <span className="macro-stat-value">{userData.macros.carbs.current}g</span>
                <span className="macro-stat-label">{userData.macros.carbs.label}</span>
                <div className="macro-mini-bar">
                  <div
                    className="macro-mini-bar-fill carbs"
                    style={{ width: `${(userData.macros.carbs.current / userData.macros.carbs.goal) * 100}%` }}
                  />
                </div>
                <span className="macro-stat-goal">/ {userData.macros.carbs.goal}g</span>
              </div>
            </div>

            <div className="macro-stat">
              <div className="macro-stat-icon fat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="macro-stat-info">
                <span className="macro-stat-value">{userData.macros.fat.current}g</span>
                <span className="macro-stat-label">{userData.macros.fat.label}</span>
                <div className="macro-mini-bar">
                  <div
                    className="macro-mini-bar-fill fat"
                    style={{ width: `${(userData.macros.fat.current / userData.macros.fat.goal) * 100}%` }}
                  />
                </div>
                <span className="macro-stat-goal">/ {userData.macros.fat.goal}g</span>
              </div>
            </div>

            <div className="macro-stat">
              <div className="macro-stat-icon fiber">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c-4-3-8-6-8-10a8 8 0 0 1 16 0c0 4-4 7-8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="macro-stat-info">
                <span className="macro-stat-value">{userData.macros.fiber.current}g</span>
                <span className="macro-stat-label">{userData.macros.fiber.label}</span>
                <div className="macro-mini-bar">
                  <div
                    className="macro-mini-bar-fill fiber"
                    style={{ width: `${(userData.macros.fiber.current / userData.macros.fiber.goal) * 100}%` }}
                  />
                </div>
                <span className="macro-stat-goal">/ {userData.macros.fiber.goal}g</span>
              </div>
            </div>

            <div className="macro-stat">
              <div className="macro-stat-icon water">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="macro-stat-info">
                <span className="macro-stat-value">{userData.macros.water.current}ml</span>
                <span className="macro-stat-label">{userData.macros.water.label}</span>
                <div className="macro-mini-bar">
                  <div
                    className="macro-mini-bar-fill water"
                    style={{ width: `${(userData.macros.water.current / userData.macros.water.goal) * 100}%` }}
                  />
                </div>
                <span className="macro-stat-goal">/ {userData.macros.water.goal}ml</span>
              </div>
            </div>
          </div>
        </section>

        {/* Meal Registration */}
        <section className="meal-entry">
          <div className="meal-entry-header">
            <h3>Registrar refeicao</h3>
            <p>Escolha como deseja registrar</p>
          </div>

          <div className="meal-entry-options">
            <button
              className={`entry-option entry-photo ${preview ? 'active' : ''}`}
              onClick={() => document.getElementById('dash-image-input').click()}
            >
              <div className="entry-option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
                  <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Foto da refeicao</span>
              <small>Use a camera ou envie uma imagem</small>
            </button>

            <button
              className={`entry-option entry-manual ${showManualEntry ? 'active' : ''}`}
              onClick={() => setShowManualEntry(!showManualEntry)}
            >
              <div className="entry-option-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Registro manual</span>
              <small>Insira os dados da refeicao</small>
            </button>
          </div>

          <input
            id="dash-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden-input"
          />

          {preview && (
            <div className="photo-preview-area">
              <img src={preview} alt="Preview" className="photo-preview" />
              <button className="btn-remove-photo" onClick={handleClear}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {preview && (
            <div className="photo-actions">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descricao opcional..."
                className="photo-description"
              />
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-analyze"
              >
                {loading ? (
                  <>
                    <div className="btn-spinner-small" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Analisar refeicao
                  </>
                )}
              </button>
            </div>
          )}

          {showManualEntry && (
            <form onSubmit={handleManualSubmit} className="manual-entry-form">
              <div className="form-group">
                <label htmlFor="meal-name">Nome da refeicao</label>
                <input
                  id="meal-name"
                  type="text"
                  value={manualMeal.name}
                  onChange={(e) => setManualMeal({ ...manualMeal, name: e.target.value })}
                  placeholder="Ex: Almoco, Jantar..."
                  required
                />
              </div>
              <div className="manual-form-row">
                <div className="form-group">
                  <label htmlFor="meal-calories">Calorias (kcal)</label>
                  <input
                    id="meal-calories"
                    type="number"
                    value={manualMeal.calories}
                    onChange={(e) => setManualMeal({ ...manualMeal, calories: e.target.value })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meal-protein">Proteinas (g)</label>
                  <input
                    id="meal-protein"
                    type="number"
                    value={manualMeal.protein}
                    onChange={(e) => setManualMeal({ ...manualMeal, protein: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="manual-form-row">
                <div className="form-group">
                  <label htmlFor="meal-carbs">Carboidratos (g)</label>
                  <input
                    id="meal-carbs"
                    type="number"
                    value={manualMeal.carbs}
                    onChange={(e) => setManualMeal({ ...manualMeal, carbs: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="meal-fat">Gorduras (g)</label>
                  <input
                    id="meal-fat"
                    type="number"
                    value={manualMeal.fat}
                    onChange={(e) => setManualMeal({ ...manualMeal, fat: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <button type="submit" className="btn-add-meal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Adicionar refeicao
              </button>
            </form>
          )}
        </section>

        {/* Analysis Result */}
        {loading && (
          <section className="result-section">
            <div className="loading">
              <div className="spinner" />
              <p>Analisando sua refeicao com cuidado...</p>
            </div>
          </section>
        )}

        {result && (
          <section className="result-section">
            <div className="result-header">
              <div className="result-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2>Analise concluida</h2>
              <button className="btn-close-result" onClick={handleClear}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="calorie-hero">
              <div className="calorie-hero-value">{result.totais.calorias_kcal}</div>
              <div className="calorie-hero-label">Calorias na refeicao (kcal)</div>
            </div>

            <div className="macros-section">
              <p className="macros-title">Macronutrientes da refeicao</p>

              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">Proteinas</span>
                  <span className="macro-value">{result.totais.proteinas_g}g</span>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill protein"
                    style={{ width: `${Math.min((result.totais.proteinas_g / maxProtein) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">Carboidratos</span>
                  <span className="macro-value">{result.totais.carboidratos_g}g</span>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill carbs"
                    style={{ width: `${Math.min((result.totais.carboidratos_g / maxCarbs) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">Gorduras</span>
                  <span className="macro-value">{result.totais.gorduras_g}g</span>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill fat"
                    style={{ width: `${Math.min((result.totais.gorduras_g / maxFat) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="macro-item">
                <div className="macro-header">
                  <span className="macro-name">Fibras</span>
                  <span className="macro-value">{result.totais.fibras_g}g</span>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill fiber"
                    style={{ width: `${Math.min((result.totais.fibras_g / maxFiber) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="items-table">
              <h3>Detalhamento por alimento</h3>
              <table>
                <thead>
                  <tr>
                    <th>Alimento</th>
                    <th>Peso</th>
                    <th>Kcal</th>
                    <th>P</th>
                    <th>C</th>
                    <th>G</th>
                    <th>F</th>
                  </tr>
                </thead>
                <tbody>
                  {result.itens.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="food-name">
                          <span className="food-dot" />
                          {item.nome}
                        </div>
                      </td>
                      <td>{item.peso_gramas}g</td>
                      <td>{item.calorias_kcal}</td>
                      <td>{item.proteinas_g}g</td>
                      <td>{item.carboidratos_g}g</td>
                      <td>{item.gorduras_g}g</td>
                      <td>{item.fibras_g}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <footer className="dashboard-tip">
          <p><span className="tip-icon">💡</span> {randomTip}</p>
        </footer>
      </main>
    </div>
  )
}
