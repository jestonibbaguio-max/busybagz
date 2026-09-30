(() => {
  const watchList = document.getElementById('watch-list');
  const refreshButton = document.getElementById('refresh-stock');
  const markEntryButton = document.getElementById('mark-entry');
  const clearPositionButton = document.getElementById('clear-position');
  const chart = document.getElementById('price-chart');
  const context = chart.getContext('2d');
  const chartEmpty = document.getElementById('chart-empty');
  const exnessPriceInput = document.getElementById('exness-price');
  const calculateExnessButton = document.getElementById('calculate-exness');
  const exnessCountdown = document.getElementById('exness-countdown');
  const numberFormat = new Intl.NumberFormat('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const compactFormat = new Intl.NumberFormat('en-AU', { notation: 'compact', maximumFractionDigits: 1 });
  const state = { symbol: 'GC=F', direction: 'buy', range: '3m', loading: false, currentSetup: null, exitRefreshPending: false, manualPrice: null, manualPriceReady: false };
  const quoteCache = new Map();
  const pendingQuotes = new Map();
  let trackedPositions = {};

  try {
    trackedPositions = JSON.parse(sessionStorage.getItem('busybagz-stock-positions') || '{}');
  } catch {
    trackedPositions = {};
  }

  function saveTrackedPositions() {
    try {
      sessionStorage.setItem('busybagz-stock-positions', JSON.stringify(trackedPositions));
    } catch {
      return;
    }
  }

  function refreshSetupAfterExit() {
    if (state.exitRefreshPending) return;
    state.exitRefreshPending = true;
    delete trackedPositions[state.symbol];
    saveTrackedPositions();
    window.setTimeout(() => {
      state.exitRefreshPending = false;
      loadStock(state.symbol, true);
    }, 0);
  }

  const money = (value, currency = state.payload?.currency || 'AUD') => {
    if (!Number.isFinite(value)) return '--';
    return `${currency === 'USD' ? 'US$' : 'A$'}${numberFormat.format(value)}`;
  };
  function setLevelMoney(element, value, currency = state.payload?.currency || 'AUD') {
    if (!Number.isFinite(value)) {
      element.textContent = '--';
      return;
    }
    const currencyLabel = currency === 'USD' ? 'US$' : 'A$';
    element.innerHTML = `<span class="level-currency">${currencyLabel}</span><span class="level-amount">${value.toFixed(2)}</span>`;
  }
  const pct = (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

  function calculateAtr(bars) {
    const recent = bars.slice(-13);
    const trueRanges = recent.slice(1).map((bar, index) => {
      const priorClose = recent[index].close;
      return Math.max(bar.high - bar.low, Math.abs(bar.high - priorClose), Math.abs(bar.low - priorClose));
    });
    const sample = trueRanges.slice(-12);
    return sample.length ? sample.reduce((sum, range) => sum + range, 0) / sample.length : NaN;
  }

  function renderSuggestions(entry, atr, isSell) {
    const suggestions = document.getElementById('trade-suggestions');
    suggestions.replaceChildren();

    if (!Number.isFinite(entry) || entry <= 0 || !Number.isFinite(atr)) {
      const message = document.createElement('p');
      message.className = 'suggestions-empty';
      message.textContent = 'Enter a valid price and load recent candles to calculate scenarios.';
      suggestions.append(message);
      return;
    }

    const direction = isSell ? 'Sell' : 'Buy';
    const setupOffsets = [
      { multiple: 0, label: 'At current price' },
      { multiple: 0.5, label: `0.5× ATR ${isSell ? 'rally' : 'pullback'}` },
      { multiple: 1, label: `1× ATR ${isSell ? 'rally' : 'pullback'}` },
    ];

    setupOffsets.forEach(({ multiple, label }) => {
      const scenarioEntry = entry + (isSell ? 1 : -1) * atr * multiple;
      const stop = isSell ? scenarioEntry + atr : Math.max(0, scenarioEntry - atr);
      const target = isSell ? Math.max(0, scenarioEntry - (atr * 2)) : scenarioEntry + (atr * 2);
      const card = document.createElement('article');
      card.className = 'suggestion-item';

      const title = document.createElement('h4');
      title.textContent = `${direction} · ${label}`;
      card.append(title);

      const levels = document.createElement('div');
      levels.className = 'suggestion-levels';
      [
        ['Entry', scenarioEntry],
        ['Stop', stop],
        ['Target', target],
      ].forEach(([name, value]) => {
        const level = document.createElement('div');
        const labelElement = document.createElement('span');
        labelElement.textContent = name;
        const valueElement = document.createElement('strong');
        valueElement.textContent = money(value);
        level.append(labelElement, valueElement);
        levels.append(level);
      });
      card.append(levels);
      suggestions.append(card);
    });
  }

  function visibleBars() {
    const bars = state.payload?.bars || [];
    return state.range === '1m' ? bars.slice(-22) : bars;
  }

  function drawChart() {
    const bars = visibleBars();
    const bounds = chart.getBoundingClientRect();
    if (!bounds.width || !bounds.height || !bars.length) return;

    const pixelRatio = window.devicePixelRatio || 1;
    chart.width = Math.round(bounds.width * pixelRatio);
    chart.height = Math.round(bounds.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);

    const inset = { top: 12, right: 58, bottom: 23, left: 2 };
    const width = bounds.width - inset.left - inset.right;
    const height = bounds.height - inset.top - inset.bottom;
    const values = bars.map((bar) => bar.close);
    const low = Math.min(...values);
    const high = Math.max(...values);
    const padding = Math.max((high - low) * 0.14, high * 0.004);
    const min = low - padding;
    const max = high + padding;
    const xFor = (index) => inset.left + (index / Math.max(bars.length - 1, 1)) * width;
    const yFor = (value) => inset.top + ((max - value) / (max - min)) * height;

    context.font = '11px Manrope, sans-serif';
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    context.strokeStyle = '#e6ece7';
    context.fillStyle = '#89968d';
    context.lineWidth = 1;

    for (let index = 0; index < 4; index += 1) {
      const y = inset.top + (index / 3) * height;
      const value = max - (index / 3) * (max - min);
      context.beginPath();
      context.moveTo(inset.left, y);
      context.lineTo(inset.left + width, y);
      context.stroke();
      context.fillText(numberFormat.format(value), bounds.width - 3, y);
    }

    const gradient = context.createLinearGradient(0, inset.top, 0, inset.top + height);
    gradient.addColorStop(0, 'rgba(22, 115, 75, 0.2)');
    gradient.addColorStop(1, 'rgba(22, 115, 75, 0)');
    context.beginPath();
    bars.forEach((bar, index) => {
      const x = xFor(index);
      const y = yFor(bar.close);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.lineTo(xFor(bars.length - 1), inset.top + height);
    context.lineTo(xFor(0), inset.top + height);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    bars.forEach((bar, index) => {
      const x = xFor(index);
      const y = yFor(bar.close);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.strokeStyle = '#16734b';
    context.lineWidth = 2;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.stroke();

    const firstDate = new Date(bars[0].time).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    const lastDate = new Date(bars[bars.length - 1].time).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    context.fillStyle = '#89968d';
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    context.fillText(firstDate, inset.left, bounds.height - 3);
    context.textAlign = 'right';
    context.fillText(lastDate, inset.left + width, bounds.height - 3);
  }

  function renderPlan() {
    if (!state.payload) return;
    const bars = state.payload.bars;
    const atr = calculateAtr(bars);
    const hasExnessPrice = state.symbol === 'GC=F' && state.manualPriceReady && Number.isFinite(state.manualPrice);
    const current = hasExnessPrice
      ? state.manualPrice
      : (Number.isFinite(state.payload.price) ? state.payload.price : bars.at(-1)?.close);
    const isSell = state.direction === 'sell';
    const entry = state.symbol === 'GC=F' && !hasExnessPrice
      ? NaN
      : (hasExnessPrice ? state.manualPrice : current);
    const stopElement = document.getElementById('stop-price');
    const targetElement = document.getElementById('target-price');
    const stopDistance = document.getElementById('stop-distance');
    const targetDistance = document.getElementById('target-distance');
    const planStatus = document.getElementById('plan-status');
    const activePosition = trackedPositions[state.symbol];
    markEntryButton.hidden = true;
    clearPositionButton.hidden = true;
    state.currentSetup = null;

    document.getElementById('atr-value').textContent = money(atr);
    document.getElementById('breakout-value').textContent = money(Math.max(...bars.slice(-12).map((bar) => bar.high)));
    setLevelMoney(document.getElementById('start-price'), entry);
    planStatus.className = 'plan-status';

    if (!Number.isFinite(entry) || entry <= 0 || !Number.isFinite(atr)) {
      renderSuggestions(NaN, atr, isSell);
      document.getElementById('start-price').textContent = '--';
      stopElement.textContent = '--';
      targetElement.textContent = '--';
      planStatus.textContent = state.symbol === 'GC=F'
        ? 'Enter your current Exness XAU/USD price to calculate the trade levels from Yahoo hourly data.'
        : 'Not enough recent Yahoo hourly data to calculate the 12-hour setup.';
      return;
    }

    renderSuggestions(entry, atr, isSell);
    const calculatedStop = isSell ? entry + atr : Math.max(0, entry - atr);
    const calculatedTarget = isSell ? Math.max(0, entry - (atr * 2)) : entry + (atr * 2);
    const planEntry = activePosition?.entry ?? entry;
    const stop = activePosition?.stop ?? calculatedStop;
    const target = activePosition?.target ?? calculatedTarget;
    const stopRisk = (Math.abs(planEntry - stop) / planEntry) * 100;
    const targetReward = (Math.abs(target - planEntry) / planEntry) * 100;
    setLevelMoney(document.getElementById('start-price'), planEntry);
    setLevelMoney(stopElement, stop);
    setLevelMoney(targetElement, target);
    stopDistance.textContent = `${stopRisk.toFixed(2)}% ${isSell ? 'above' : 'below'} entry · 1× ATR`;
    targetDistance.textContent = `${targetReward.toFixed(2)}% ${isSell ? 'below' : 'above'} entry · 2× ATR`;
    state.currentSetup = { entry, stop: calculatedStop, target: calculatedTarget, direction: state.direction };

    if (activePosition) {
      clearPositionButton.hidden = false;
      const positionIsSell = activePosition.direction === 'sell';
      const stopHit = positionIsSell ? current >= activePosition.stop : current <= activePosition.stop;
      const targetHit = positionIsSell ? current <= activePosition.target : current >= activePosition.target;
      if (activePosition.status === 'stop' || stopHit) {
        activePosition.status = 'stop';
        planStatus.textContent = `STOP LOSS HIT · Price is ${positionIsSell ? 'at or above' : 'at or below'} ${money(activePosition.stop)}. The tracked setup is closed.`;
        planStatus.classList.add('is-alert');
        saveTrackedPositions();
        refreshSetupAfterExit();
      } else if (activePosition.status === 'target' || targetHit) {
        activePosition.status = 'target';
        planStatus.textContent = `TAKE-PROFIT HIT · Price is ${positionIsSell ? 'at or below' : 'at or above'} ${money(activePosition.target)}. The tracked setup reached its target.`;
        planStatus.classList.add('is-target');
        saveTrackedPositions();
        refreshSetupAfterExit();
      } else {
        planStatus.textContent = `${positionIsSell ? 'SELL' : 'BUY'} POSITION ACTIVE · Current ${money(current)}. Stop ${money(activePosition.stop)}; take-profit ${money(activePosition.target)}.`;
      }
    } else {
      planStatus.textContent = `${isSell ? 'SELL' : 'BUY'} LEVELS READY · Open ${money(entry)}; stop ${money(stop)}; take-profit ${money(target)}. Based on the latest 12 Yahoo hourly candles.`;
      markEntryButton.hidden = false;
    }
  }

  function renderQuote(payload) {
    const bars = payload.bars || [];
    const latest = bars.at(-1);
    const prior = bars.at(-2);
    const yahooPrice = Number.isFinite(payload.price) ? payload.price : latest?.close;
    const price = state.symbol === 'GC=F' && state.manualPriceReady && Number.isFinite(state.manualPrice)
      ? state.manualPrice
      : yahooPrice;
    const change = prior && price ? ((price - prior.close) / prior.close) * 100 : NaN;

    document.getElementById('quote-symbol').innerHTML = `${payload.symbol} <span>· ${payload.exchange}</span>`;
    document.getElementById('quote-name').textContent = payload.name;
    document.getElementById('quote-price').textContent = money(price);
    const changeElement = document.getElementById('quote-change');
    const isExnessPrice = state.symbol === 'GC=F' && state.manualPriceReady && Number.isFinite(state.manualPrice);
    changeElement.textContent = Number.isFinite(change)
      ? `${pct(change)} ${isExnessPrice ? 'vs Yahoo close' : 'today'}`
      : 'Change unavailable';
    changeElement.className = `quote-change${Number.isFinite(change) ? (change >= 0 ? ' is-up' : ' is-down') : ''}`;

    const marketDate = payload.marketTime || latest?.time;
    document.getElementById('market-time').textContent = marketDate
      ? `Last market data ${new Date(marketDate).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Sydney' })} AEST/AEDT`
      : 'Market timestamp unavailable';
    document.getElementById('quote-source').textContent = state.symbol === 'GC=F' && state.manualPriceReady
      ? 'Current price: Exness · Volatility: Yahoo Finance'
      : `Source: ${payload.source || 'Market data feed'}`;

    const displayed = visibleBars();
    const low = Math.min(...displayed.map((bar) => bar.low));
    document.getElementById('period-low').textContent = money(low);
    document.getElementById('quote-volume').textContent = latest?.volume ? compactFormat.format(latest.volume) : '--';
    chartEmpty.hidden = true;
    chart.hidden = false;
    chart.setAttribute('aria-label', `${payload.name} hourly closing prices over the latest trading sessions`);
    drawChart();
    renderPlan();
  }

  function renderWatchQuote(symbol, payload) {
    const item = watchList.querySelector(`[data-symbol="${symbol}"]`);
    if (!item) return;
    const price = Number.isFinite(payload.price) ? payload.price : payload.bars.at(-1)?.close;
    const previous = payload.bars.at(-2)?.close;
    const change = previous && price ? ((price - previous) / previous) * 100 : NaN;
    item.querySelector('[data-watch-price]').textContent = money(price);
    const changeElement = item.querySelector('[data-watch-change]');
    changeElement.textContent = Number.isFinite(change) ? pct(change) : '--';
    changeElement.className = Number.isFinite(change) ? (change >= 0 ? 'is-up' : 'is-down') : '';
  }

  function fetchQuote(symbol, forceRefresh = false) {
    if (!forceRefresh && quoteCache.has(symbol)) return Promise.resolve(quoteCache.get(symbol));
    if (pendingQuotes.has(symbol)) return pendingQuotes.get(symbol);

    const request = fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.message || 'Market data request failed.');
        quoteCache.set(symbol, payload);
        return payload;
      })
      .finally(() => pendingQuotes.delete(symbol));

    pendingQuotes.set(symbol, request);
    return request;
  }

  async function loadStock(symbol = state.symbol, forceRefresh = false) {
    state.loading = true;
    refreshButton.disabled = true;
    refreshButton.classList.add('is-loading');
    document.getElementById('market-time').textContent = 'Fetching delayed market data...';

    try {
      const payload = await fetchQuote(symbol, forceRefresh);
      const selectionChanged = state.payload?.symbol !== payload.symbol;
      state.symbol = symbol;
      state.payload = payload;
      watchList.querySelectorAll('.watch-item').forEach((item) => {
        const selected = item.dataset.symbol === symbol;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      renderQuote(payload);
      renderWatchQuote(symbol, payload);
    } catch (error) {
      document.getElementById('market-time').textContent = error.message;
      const planStatus = document.getElementById('plan-status');
      planStatus.textContent = error.message;
      planStatus.className = 'plan-status is-alert';
      if (!state.payload) {
        chart.hidden = true;
        chartEmpty.hidden = false;
        chartEmpty.textContent = error.message;
      }
    } finally {
      state.loading = false;
      refreshButton.disabled = false;
      refreshButton.classList.remove('is-loading');
    }
  }

  watchList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-symbol]');
    if (!button || state.loading || button.dataset.symbol === state.symbol) return;
    loadStock(button.dataset.symbol);
  });
  refreshButton.addEventListener('click', () => loadStock(state.symbol, true));
  document.querySelector('.trade-direction').addEventListener('click', (event) => {
    const button = event.target.closest('[data-direction]');
    if (!button) return;
    state.direction = button.dataset.direction;
    document.querySelectorAll('[data-direction]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    if (state.payload) renderQuote(state.payload);
  });
  calculateExnessButton.addEventListener('click', () => {
    const price = Number(exnessPriceInput.value);
    if (!Number.isFinite(price) || price <= 0) {
      exnessCountdown.textContent = 'Enter a valid Exness XAUUSD price.';
      exnessPriceInput.focus();
      return;
    }
    state.manualPrice = price;
    state.manualPriceReady = true;
    exnessCountdown.textContent = 'Exness quote applied as the current XAU/USD and open price.';
    if (state.payload) renderQuote(state.payload);
  });
  markEntryButton.addEventListener('click', () => {
    if (!state.currentSetup) return;
    trackedPositions[state.symbol] = state.currentSetup;
    saveTrackedPositions();
    renderPlan();
  });
  clearPositionButton.addEventListener('click', () => {
    delete trackedPositions[state.symbol];
    saveTrackedPositions();
    renderPlan();
  });
  document.querySelector('.range-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-range]');
    if (!button) return;
    state.range = button.dataset.range;
    document.querySelectorAll('[data-range]').forEach((tab) => tab.setAttribute('aria-pressed', String(tab === button)));
    if (state.payload) renderQuote(state.payload);
  });
  window.addEventListener('resize', drawChart);
  if ('ResizeObserver' in window) new ResizeObserver(drawChart).observe(chart.parentElement);
  window.setInterval(() => {
    if (!state.loading) loadStock(state.symbol, true);
  }, 300000);

  loadStock();
  watchList.querySelectorAll('[data-symbol]').forEach((item) => {
    if (item.dataset.symbol !== state.symbol) {
      fetchQuote(item.dataset.symbol)
        .then((payload) => renderWatchQuote(item.dataset.symbol, payload))
        .catch(() => { item.querySelector('[data-watch-change]').textContent = 'Unavailable'; });
    }
  });
})();
