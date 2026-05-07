import './style.css'

// Mock Data representing realistic enterprise data
const ALERTS_DATA = [
  {
    id: 'XBB.1.5-C',
    date: '2026-05-07 10:42',
    score: 94,
    mutations: ['S:K417N', 'S:E484K', 'S:F486P'],
    targets: [
      { name: 'Lipid Nanoparticle Target A', match: 92 },
      { name: 'TLR7/8 Agonist V2', match: 88 },
      { name: 'Squalene-based Emulsion', match: 74 }
    ]
  },
  {
    id: 'BA.2.86-DELTA',
    date: '2026-05-07 09:15',
    score: 82,
    mutations: ['S:L452R', 'S:F486V'],
    targets: [
      { name: 'Matrix-M Adjuvant', match: 95 },
      { name: 'AS03 Emulsion', match: 81 },
      { name: 'Alum-CpG Complex', match: 68 }
    ]
  },
  {
    id: 'H5N1-V26',
    date: '2026-05-06 22:30',
    score: 89,
    mutations: ['HA:Q226L', 'HA:G228S'],
    targets: [
      { name: 'MF59 Adjuvant', match: 91 },
      { name: 'TLR9 Pathway Modulator', match: 84 },
      { name: 'Saponin Extract Q-21', match: 79 }
    ]
  },
  {
    id: 'RSV-A-2026',
    date: '2026-05-06 18:12',
    score: 45,
    mutations: ['F:S259L'],
    targets: [
      { name: 'Alum Standard', match: 98 },
      { name: 'GLA-SE Agonist', match: 62 },
      { name: 'TLR4 Inhibitor', match: 45 }
    ]
  }
]

// Render Alert Feed
const renderAlertFeed = () => {
  const tbody = document.getElementById('alert-feed-body')
  if (!tbody) return

  tbody.innerHTML = ALERTS_DATA.map((alert, index) => {
    const isCritical = alert.score > 85
    const barColor = isCritical ? '#FF1744' : (alert.score > 70 ? '#FF9100' : '#00E5FF')
    
    return `
      <tr class="alert-row ${isCritical ? 'critical' : ''}" data-index="${index}">
        <td class="mutation-id-cell">${alert.id}</td>
        <td class="mono" style="font-size: 0.8rem; color: var(--text-secondary);">${alert.date}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="progress-container">
              <div class="progress-bar" style="width: ${alert.score}%; background: ${barColor};"></div>
            </div>
            <span class="mono" style="font-size: 0.85rem; width: 30px;">${alert.score}</span>
          </div>
        </td>
        <td>
          <button class="btn-action view-details-btn" data-index="${index}">View Targets</button>
        </td>
      </tr>
    `
  }).join('')

  // Add Click Listeners
  document.querySelectorAll('.alert-row').forEach(row => {
    row.addEventListener('click', () => {
      const index = row.getAttribute('data-index')
      showMutationDetail(ALERTS_DATA[index])
    })
  })
}

// Show Mutation Detail
const showMutationDetail = (alert) => {
  const detailPanel = document.getElementById('mutation-detail-panel')
  const detailId = document.getElementById('detail-mutation-id')
  const targetList = document.getElementById('target-recommendations-list')

  if (!detailPanel || !detailId || !targetList) return

  detailId.textContent = alert.id
  
  targetList.innerHTML = alert.targets.map(target => `
    <div class="target-item">
      <div class="target-info">
        <h4>${target.name}</h4>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Match probability based on current structural shift.</div>
      </div>
      <div class="target-match">${target.match}% MATCH</div>
    </div>
  `).join('')

  detailPanel.style.display = 'block'
  
  // Smooth scroll to detail panel
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Global State
let openTabs = [{ id: 'dashboard', title: 'Global Dashboard' }]
let activeTabId = 'dashboard'

// Tab Management
const renderTabs = () => {
  const container = document.getElementById('tab-bar-container')
  if (!container) return

  container.innerHTML = openTabs.map(tab => `
    <div class="tab ${tab.id === activeTabId ? 'active' : ''}" data-id="${tab.id}">
      <span>${tab.title}</span>
      <svg class="tab-close" data-id="${tab.id}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </div>
  `).join('')

  // Tab click listeners
  document.querySelectorAll('.tab').forEach(tabEl => {
    tabEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close') || e.target.closest('.tab-close')) {
        closeTab(tabEl.dataset.id)
      } else {
        switchTab(tabEl.dataset.id)
      }
    })
  })
}

const openTab = (id, title) => {
  if (!openTabs.find(t => t.id === id)) {
    openTabs.push({ id, title })
  }
  switchTab(id)
}

const switchTab = (id) => {
  activeTabId = id
  renderTabs()
  // Update view visibility if multiple views existed (currently we only have one dashboard structure)
  // For now, we'll just update the header title to show navigation worked
  const titleMap = {
    dashboard: 'Bio-Intelligence Dashboard',
    alerts: 'Live Alerts Feed',
    discovery: 'Target Discovery Lab',
    settings: 'System Configuration'
  }
  const h1 = document.querySelector('.header-info h1')
  if (h1) h1.textContent = titleMap[id] || id.toUpperCase()
}

const closeTab = (id) => {
  if (openTabs.length === 1) return // Keep at least one tab
  openTabs = openTabs.filter(t => t.id !== id)
  if (activeTabId === id) {
    activeTabId = openTabs[openTabs.length - 1].id
  }
  renderTabs()
}

// Sidebar Navigation Logic
const setupNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-link')
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const id = link.getAttribute('data-page')
      const title = link.getAttribute('data-title')
      openTab(id, title)
    })
  })
}

// Login Handling
const setupLogin = () => {
  const loginForm = document.getElementById('login-form')
  const loginPortal = document.getElementById('login-portal')
  const app = document.getElementById('app')

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault()
      loginPortal.style.display = 'none'
      app.style.display = 'flex'
      // Trigger initial animations
      renderAlertFeed()
      renderTicker()
      spawnMapMarkers()
    })
  }
}

// Render Ticker
const renderTicker = () => {
  const ticker = document.getElementById('genomic-ticker')
  if (!ticker) return

  const tickerData = [
    { label: 'SEQ_SCAN', value: 'SARS-CoV-2 XBB.1.5.102 detected in Berlin' },
    { label: 'RISK_UP', value: 'Evasion score for BA.2.86 updated to 94.2%' },
    { label: 'TARGET_FOUND', value: 'New Adjuvant Target (C3-Linker) validated' },
    { label: 'SUBSCRIPTION', value: 'Moderna Global access granted' },
    { label: 'ALERT', value: 'Critical shift in Spike protein glycosylation motif' }
  ]

  const items = [...tickerData, ...tickerData].map(item => `
    <div class="ticker-item"><b>[${item.label}]</b> ${item.value}</div>
  `).join('')

  ticker.innerHTML = items
}

// Spawn Map Markers
const spawnMapMarkers = () => {
  const container = document.getElementById('map-markers-container')
  if (!container) return

  const markerCount = 12
  for (let i = 0; i < markerCount; i++) {
    const dot = document.createElement('div')
    dot.className = 'pulse-dot'
    dot.style.top = `${Math.random() * 80 + 10}%`
    dot.style.left = `${Math.random() * 80 + 10}%`
    dot.style.animationDelay = `${Math.random() * 2}s`
    container.appendChild(dot)
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupLogin()
  setupNavigation()
  renderTabs()
  
  // Background animation (independent of login)
  setInterval(() => {
    const dots = document.querySelectorAll('.pulse-dot')
    dots.forEach(dot => {
      if (Math.random() > 0.8) {
        dot.style.top = `${Math.max(10, Math.min(90, parseFloat(dot.style.top) + (Math.random() * 4 - 2)))}%`
        dot.style.left = `${Math.max(10, Math.min(90, parseFloat(dot.style.left) + (Math.random() * 4 - 2)))}%`
      }
    })
  }, 2000)
})
