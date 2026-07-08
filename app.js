// ---- Rendering + interactivity. Reads content from data.js ----

function initials(abbr){ return abbr.slice(0,3); }

function matchSlug(m){
  return m.slug || `${m.home}-${m.away}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function postSlug(p){
  return p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function matchCardHTML(m){
  const livePill = m.status === "live"
    ? `<div class="live-pill"><span class="dot-live"></span>LIVE</div>`
    : `<div class="live-pill" style="color:var(--gray)">${m.date.split(",")[0]}</div>`;

  return `
    <article class="match-card">
      <div class="scoreboard">
        ${livePill}
        <div class="teams-row">
          <div class="team">
            <div class="badge" style="background:${m.homeColor}">${m.homeAbbr}</div>
            <div class="team-name">${m.home}</div>
          </div>
          <div class="vs">VS</div>
          <div class="team">
            <div class="badge" style="background:${m.awayColor}">${m.awayAbbr}</div>
            <div class="team-name">${m.away}</div>
          </div>
        </div>
        <div class="kickoff mono">${m.date} · ${m.time}</div>
      </div>
      <div class="match-body">
        <div class="match-meta">
          <span class="tag">${m.group}</span>
          <span>${m.stadium}</span>
        </div>
        <h3>${m.home} vs ${m.away} — Live Channel &amp; Match Info</h3>
        <p>${m.summary}</p>
        <div class="match-footer">
          <span class="stat">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
            ${m.time}
          </span>
          <a class="read-more" href="match-details.html?match=${matchSlug(m)}">Match Details →</a>
        </div>
      </div>
    </article>
  `;
}

function popularItemHTML(p, i){
  return `
    <a class="popular-item" href="popular-posts.html?post=${postSlug(p)}">
      <div class="rank mono">${String(i+1).padStart(2,'0')}</div>
      <div>
        <div class="p-title">${p.title}</div>
        <div class="p-meta">${p.meta}</div>
      </div>
    </a>
  `;
}

function fixtureRowHTML(f){
  return `
    <div class="fixture-row">
      <span class="fixture-teams">${f.teams}</span>
      <span class="fixture-time mono">${f.time}</span>
    </div>
  `;
}

// ---- Render ----
const PAGE_SIZE = 4;
let visibleCount = PAGE_SIZE;

function renderMatches(){
  const list = document.getElementById('matchList');
  const slice = MATCHES.slice(0, visibleCount);
  list.innerHTML = slice.map(matchCardHTML).join('');
  document.getElementById('matchCount').textContent = `${MATCHES.length} fixtures`;

  const btn = document.getElementById('loadMoreBtn');
  btn.style.display = visibleCount >= MATCHES.length ? 'none' : 'block';
}

document.getElementById('popularList').innerHTML = POPULAR_POSTS.map(popularItemHTML).join('');
document.getElementById('upcomingList').innerHTML = UPCOMING.map(fixtureRowHTML).join('');

// ticker: duplicate list for seamless loop
const tickerHTML = TICKER_ITEMS.map(t => `<div class="tick"><span class="dot-live"></span><span class="mono">${t}</span></div>`).join('');
document.getElementById('tickerTrack').innerHTML = tickerHTML + tickerHTML;

renderMatches();

document.getElementById('loadMoreBtn').addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderMatches();
});

document.getElementById('subscribeBtn').addEventListener('click', () => {
  const input = document.querySelector('.newsletter input');
  const btn = document.getElementById('subscribeBtn');
  if(!input.value || !input.value.includes('@')){
    input.style.borderColor = '#FF4D4D';
    return;
  }
  input.style.borderColor = 'var(--pitch-bright)';
  btn.textContent = 'You\'re subscribed ✓';
  btn.style.background = 'var(--pitch-bright)';
  btn.style.color = '#08170D';
});
