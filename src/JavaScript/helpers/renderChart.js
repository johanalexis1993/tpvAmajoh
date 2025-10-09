export const renderChart = (data, period, containerId) => {
  const c = document.getElementById(containerId)
  if (!c) return console.error(`Canvas con ID '${containerId}' no encontrado`)
  const ctx = c.getContext('2d')
  const dpr = window.devicePixelRatio ?? 1
  let tip = document.body.querySelector('.tpv-tooltip')
  if (!tip) {
    tip = document.createElement('div')
    tip.className = 'tpv-tooltip'
    document.body.append(tip)
  }
  const fmtEUR = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
  let animId = null,
    prog = 0,
    bars = []
  const css = getComputedStyle(document.documentElement)
  const colorText = css.getPropertyValue('--color-text')?.trim() || '#444'
  const colorHighlight =
    css.getPropertyValue('--color-highlight')?.trim() || '#4BC0C0'
  const setup = () => {
    const w = c.parentElement.clientWidth
    const h = Math.max(300, window.innerHeight * 0.4)
    c.style.width = w + 'px'
    c.style.height = h + 'px'
    c.width = w * dpr
    c.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  const prep = () => {
    const rootFS =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const pad = 50
    const baseFS = 0.75 * rootFS
    const scaleF = Math.min(Math.max(c.width / 1000, 0.5), 1.2)
    const fS = baseFS * scaleF
    const labels =
      period === 'day'
        ? Array.from({ length: 31 }, (_, i) => `${i + 1}`)
        : period === 'month'
        ? [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
          ]
        : data.map((d) => `${d.year}`)
    const vals =
      period === 'day'
        ? (() => {
            const arr = Array(31).fill(0)
            data.forEach((d) => (arr[d.day - 1] = d.totalSales))
            return arr
          })()
        : period === 'month'
        ? (() => {
            const arr = Array(12).fill(0)
            data.forEach((d) => (arr[d.month - 1] = d.totalSales))
            return arr
          })()
        : data.map((d) => d.totalSales)
    const w = c.width / dpr
    const h = c.height / dpr
    const cW = w - pad * 2
    const cH = h - pad * 2
    const maxV = Math.max(...vals) || 1
    const cnt = vals.length
    const gap = Math.min((cW * 0.2) / (cnt - 1), 16)
    const barW = (cW - gap * (cnt - 1)) / cnt
    bars = labels.map((label, i) => ({
      x: pad + i * (barW + gap),
      width: barW,
      label,
      value: vals[i]
    }))
    return { w, h, cW, cH, pad, maxV, fS }
  }
  const draw = (w, h, cW, cH, pad, maxV, fS) => {
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.fillStyle = colorText
    ctx.strokeStyle = colorText
    ctx.font = `${fS}px system-ui, sans-serif`
    ctx.textBaseline = 'middle'
    ctx.beginPath()
    for (let i = 0; i <= 4; i++) {
      const y = pad + (cH * i) / 4
      ctx.moveTo(pad, y)
      ctx.lineTo(w - pad, y)
      ctx.fillText(Math.round(maxV * (1 - i / 4)), pad - 35, y)
    }
    ctx.stroke()
    ctx.fillStyle = colorHighlight
    bars.forEach((bar) => {
      const hBar = (bar.value / maxV) * cH * prog
      const y = h - pad - hBar
      ctx.fillRect(bar.x, y, bar.width, hBar)
      bar.y = y
      bar.height = hBar
    })
    ctx.fillStyle = colorText
    bars.forEach((bar) => {
      ctx.save()
      ctx.translate(bar.x + bar.width / 2, h - pad + fS / 2)
      ctx.rotate(-Math.PI / 4)
      ctx.textAlign = 'right'
      ctx.fillText(bar.label, 0, 0)
      ctx.restore()
    })
    ctx.font = `bold ${fS * 1.33}px system-ui, sans-serif`
    ctx.fillText('Ventas Totales', w / 2 - 60, fS * 1.75)
    const lx = w - 210,
      ly = 40,
      lsz = 16
    ctx.fillStyle = colorHighlight
    ctx.fillRect(lx, ly, lsz, lsz)
    ctx.strokeStyle = colorText
    ctx.strokeRect(lx, ly, lsz, lsz)
    ctx.fillStyle = colorText
    ctx.font = `bold ${fS * 1.5}px system-ui, sans-serif`
    ctx.textAlign = 'left'
    ctx.fillText('Ventas Totales (€)', lx + lsz + 8, ly + lsz - 4)
  }
  const animate = (params) => {
    draw(...params)
    if (prog < 1) {
      prog += 0.05
      animId = requestAnimationFrame(() => animate(params))
    }
  }
  c.onmousemove = (e) => {
    const r = c.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const bar = bars.find(
      (b) => x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height
    )
    if (bar) {
      tip.textContent = `${bar.label}: ${fmtEUR.format(bar.value)}`
      tip.style.left = `${e.pageX + 10}px`
      tip.style.top = `${e.pageY - 30}px`
      tip.style.display = 'block'
      tip.style.opacity = '1'
    } else {
      tip.style.opacity = '0'
      setTimeout(() => (tip.style.display = 'none'), 150)
    }
  }
  c.onmouseleave = () => {
    tip.style.opacity = '0'
    setTimeout(() => (tip.style.display = 'none'), 150)
  }
  let resizeTO = null
  const onResize = () => {
    clearTimeout(resizeTO)
    resizeTO = setTimeout(() => {
      prog = 0
      setup()
      const params = prep()
      if (animId) cancelAnimationFrame(animId)
      animate(Object.values(params))
    }, 150)
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(c.parentElement)
  setup()
  const params = prep()
  animate(Object.values(params))
}
