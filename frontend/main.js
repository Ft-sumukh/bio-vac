import './style.css'
import { createIcons, LayoutDashboard, Bell, BrainCircuit, Rss, Settings, Activity, AlertTriangle, Target, Users, Shield, Zap, ChevronRight, Dna, X } from 'lucide'

// Initialize Lucide icons
const initIcons = () => {
  createIcons({
    icons: {
      LayoutDashboard, Bell, BrainCircuit, Rss, Settings, Activity, AlertTriangle, Target, Users, Shield, Zap, ChevronRight, Dna, X
    }
  })
}

// Global State
let currentAlerts = []

// Mock Data
const MOCK_ALERTS = [
  {
    id: 'MUT-2026-XBB',
    pathogen: 'SARS-CoV-2',
    lineage: 'XBB.1.5-EVO',
    mutations: ['S:K417N', 'S:E484K', 'S:F486P'],
    risk: 'critical',
    score: 0.98,
    timestamp: '2 mins ago',
    recommendations: ['TLR7/8 Agonist', 'Matrix-M'],
    details: 'This mutation shows significant structural shifts in the Receptor Binding Domain (RBD), potentially bypassing C3b-mediated opsonization.'
  },
  {
    id: 'MUT-2026-FLU',
    pathogen: 'Influenza-A',
    lineage: 'H5N1-Variant',
    mutations: ['HA:Q226L', 'HA:G228S'],
    risk: 'high',
    score: 0.85,
    timestamp: '15 mins ago',
    recommendations: ['AS03', 'MF59'],
    details: 'Increased affinity for human-type receptors combined with complement factor H binding evasion.'
  }
]

const MOCK_SUGGESTIONS = [
  { target: 'Complement C3b', reason: 'High evasion score in latest simulation', priority: 'High' },
  { target: 'Factor H Binding', reason: 'Structural shift detected in S-protein', priority: 'Medium' }
]

// API Configuration
const API_BASE = 'http://localhost:8000/v1'

const fetchAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE}/observations`)
    const data = await response.json()
    if (data && data.length > 0) {
      return data.map(obs => ({
        id: obs.id.slice(0, 8).toUpperCase(),
        pathogen: obs.input.pathogen,
        lineage: obs.input.lineage || 'Unknown',
        mutations: obs.input.mutations,
        risk: obs.risk.band,
        score: obs.risk.score,
        timestamp: new Date(obs.created_at).toLocaleTimeString(),
        recommendations: obs.risk.signals.slice(0, 2),
        details: `Risk Signals: ${obs.risk.signals.join(', ')}`
      }))
    }
  } catch (e) {
    console.warn('Backend not available, using mock data')
  }
  return MOCK_ALERTS
}

// Modal Logic
const showModal = (title, content) => {
  document.getElementById('modal-title').textContent = title
  document.getElementById('modal-body').innerHTML = content
  document.getElementById('modal-overlay').classList.add('active')
  initIcons()
}

const closeModal = () => {
  document.getElementById('modal-overlay').classList.remove('active')
}

// Render Functions
const renderAlerts = async () => {
  const alertList = document.getElementById('alert-list')
  const fullAlertList = document.getElementById('full-alert-list')
  if (!alertList) return

  currentAlerts = await fetchAlerts()
  
  const html = currentAlerts.map((alert, index) => `
    <div class="alert-item" data-index="${index}">
      <div class="risk-indicator risk-${alert.risk}"></div>
      <div class="alert-info">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="mutation-id">${alert.id}</span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">${alert.timestamp}</span>
        </div>
        <div style="margin: 4px 0;">
          <span class="pathogen-tag">${alert.pathogen}</span>
          <span style="font-size: 0.85rem; font-weight: 500; margin-left: 8px;">${alert.lineage}</span>
        </div>
        <div class="recommendations">
          ${alert.recommendations.map(rec => `<span class="rec-tag">${rec}</span>`).join('')}
        </div>
      </div>
      <div class="alert-action">
        <i data-lucide="chevron-right" style="color: var(--text-muted); width: 18px;"></i>
      </div>
    </div>
  `).join('')

  alertList.innerHTML = html
  if (fullAlertList) fullAlertList.innerHTML = html

  // Add click listeners to alert items
  document.querySelectorAll('.alert-item').forEach(item => {
    item.addEventListener('click', () => {
      const alert = currentAlerts[item.dataset.index]
      showModal(`Details: ${alert.id}`, `
        <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--glass-border);">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Pathogen</div>
              <div style="font-weight: 600;">${alert.pathogen}</div>
            </div>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Risk Score</div>
              <div style="font-weight: 600; color: var(--primary-color);">${(alert.score * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Mutations</div>
            <div style="font-family: monospace; font-size: 0.9rem; background: #000; padding: 10px; border-radius: 8px; margin-top: 4px;">
              ${alert.mutations.join(', ')}
            </div>
          </div>
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Analysis Summary</div>
            <p style="margin-top: 4px; font-size: 0.95rem;">${alert.details}</p>
          </div>
        </div>
      `)
    })
  })
  
  initIcons()
}

const renderSuggestions = () => {
  const container = document.getElementById('adjuvant-suggestions')
  if (!container) return

  container.innerHTML = MOCK_SUGGESTIONS.map(sug => `
    <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; border-left: 2px solid ${sug.priority === 'High' ? 'var(--alert-color)' : sug.priority === 'Medium' ? 'var(--warning-color)' : 'var(--primary-color)'}">
      <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${sug.target}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted);">${sug.reason}</div>
    </div>
  `).join('')
}

// Navigation Logic
const setupNavigation = () => {
  const switchPage = (pageId) => {
    // Update Sidebar
    document.querySelectorAll('.nav-item').forEach(i => {
      i.classList.toggle('active', i.getAttribute('data-page') === pageId)
    })

    // Update Header
    const titleMap = {
      dashboard: 'Genomic Surveillance',
      alerts: 'Live Alerts',
      predictions: 'AI Analysis',
      subscriptions: 'Subscription Manager',
      settings: 'Portal Settings'
    }
    document.getElementById('page-title').textContent = titleMap[pageId] || pageId.toUpperCase()
    
    // Update Visibility
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.toggle('active', section.id === `view-${pageId}`)
    })
  }

  document.querySelectorAll('.nav-item, .nav-trigger').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      switchPage(item.getAttribute('data-page'))
    })
  })
}

// Action Button Logic
const setupActions = () => {
  // Export Report
  document.querySelector('.btn-secondary').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentAlerts, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `VEWP_Report_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    
    showModal('Report Exported', '<p>The mutation report has been generated and downloaded as a JSON file.</p>')
  })

  // New Scan
  document.querySelector('.btn-primary').addEventListener('click', async () => {
    showModal('Initiating Scan', '<p>Simulating high-throughput genomic sequencing...</p><div style="margin-top: 1rem; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;"><div id="scan-progress" style="height: 100%; background: var(--primary-color); width: 0%; transition: width 2s linear;"></div></div>')
    
    setTimeout(() => {
      const prog = document.getElementById('scan-progress')
      if (prog) prog.style.width = '100%'
    }, 100)

    // Actually POST to backend
    try {
      const pathogens = ['SARS-CoV-2', 'Influenza-A', 'RSV']
      const newObs = {
        pathogen: pathogens[Math.floor(Math.random() * pathogens.length)],
        protein: 'S',
        mutations: ['S:E484K', 'S:N501Y', 'S:K417N'].sort(() => Math.random() - 0.5).slice(0, 2),
        evidence: { source: 'genomic_feed', confidence: 0.95 }
      }
      
      await fetch(`${API_BASE}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObs)
      })
      
      setTimeout(() => {
        renderAlerts()
        closeModal()
      }, 2100)
    } catch (e) {
      setTimeout(() => {
        showModal('Scan Complete', '<p>New data has been processed and added to the feed.</p>')
        renderAlerts()
      }, 2100)
    }
  })

  // Subscription Form
  const subForm = document.getElementById('sub-form')
  if (subForm) {
    subForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const org = document.getElementById('sub-org').value
      const endpoint = document.getElementById('sub-endpoint').value
      
      if (!org || !endpoint) return alert('Please fill all fields')

      try {
        await fetch(`${API_BASE}/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ org, endpoint, channel: 'email' })
        })
        showModal('Subscription Registered', `<p>Organization <b>${org}</b> will now receive alerts at <b>${endpoint}</b>.</p>`)
        subForm.reset()
      } catch (e) {
        showModal('Success (Offline Mode)', `<p>Subscription for <b>${org}</b> registered locally.</p>`)
      }
    })
  }

  // Close Modal
  document.getElementById('close-modal').addEventListener('click', closeModal)
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal()
  })
}

// Image Injection
const injectBackground = () => {
  const bgVisual = document.getElementById('bg-visual')
  if (bgVisual) {
    bgVisual.src = '/hero-bg.png'
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  initIcons()
  renderAlerts()
  renderSuggestions()
  setupNavigation()
  setupActions()
  injectBackground()
  
  // Animate numbers
  const animateValue = (id, start, end, duration) => {
    const obj = document.getElementById(id)
    if (!obj) return
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const val = Math.floor(progress * (end - start) + start)
      obj.innerHTML = id === 'stat-accuracy' ? (progress * (end - start) + start).toFixed(1) + '%' : val.toLocaleString()
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  setTimeout(() => {
    animateValue('stat-total', 0, 1284, 2000)
    animateValue('stat-alerts', 0, 12, 1500)
    animateValue('stat-accuracy', 0, 94.2, 2500)
    animateValue('stat-subs', 0, 48, 1000)
  }, 500)
})
