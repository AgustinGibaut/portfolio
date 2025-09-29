
    const GITHUB_USER = 'AgustinGibaut';


    const BACKEND_FOR_TOKEN = null; 

    const root = document.getElementById('github-stats-root');

    async function fetchJSON(url, options = {}) {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      return await res.json();
    }


    async function fetchAllRepos(username) {
      let page = 1;
      const perPage = 100;
      let all = [];
      while (true) {
        const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`;
        const data = await fetchJSON(url);
        if (!data || data.length === 0) break;
        all = all.concat(data);
        if (data.length < perPage) break;
        page++;
      }
      return all;
    }


    async function maybeFetchWithBackend(url) {
      if (!BACKEND_FOR_TOKEN) return fetchJSON(url);
   
      const proxyUrl = `${BACKEND_FOR_TOKEN}?u=${encodeURIComponent(url)}`;
      return fetchJSON(proxyUrl);
    }

    async function render() {
      try {
        root.innerHTML = '<div class="loading">Cargando datos del usuario...</div>';

        const userUrl = `https://api.github.com/users/${GITHUB_USER}`;
        const user = await maybeFetchWithBackend(userUrl);

        root.innerHTML = '<div class="loading">Obteniendo repositorios (esto puede tardar si hay muchos)...</div>';
        const repos = await fetchAllRepos(GITHUB_USER);

        let totalStars = 0;
        const langCounts = {}; 
        repos.forEach(r => {
          totalStars += (r.stargazers_count || 0);
          if (r.language) {
            langCounts[r.language] = (langCounts[r.language] || 0) + 1; // contamos repos por lenguaje
          } else {
            langCounts["Sin lenguaje"] = (langCounts["Sin lenguaje"] || 0) + 1;
          }
        });

        const langsSorted = Object.entries(langCounts)
          .sort((a,b) => b[1] - a[1])
          .slice(0, 6); 

        root.innerHTML = `
          <div class="gh-header">
            <img class="gh-avatar" src="${user.avatar_url}" alt="avatar ${user.login}" />
            <div>
              <p class="gh-name">${user.name || user.login}</p>
              <p class="gh-login">@${user.login} · <span class="small">${user.location || ''}</span></p>
              <p class="small">${user.company || ''}</p>
            </div>
          </div>

          <p class="gh-bio">${user.bio || ''}</p>

          <div class="gh-stats">
            <div class="stat">Repos públicos: ${user.public_repos}</div>
            <div class="stat">Followers: ${user.followers}</div>
            <div class="stat">Following: ${user.following}</div>
            <div class="stat">⭐ Total stars: ${totalStars}</div>
          </div>

          <div style="margin-top:10px;">
            <div class="small">Top lenguajes</div>
            <div class="lang-list">
              ${langsSorted.map(l => `<span class="lang">${l[0]} · ${l[1]}</span>`).join('')}
            </div>
          </div>

          <div style="margin-top:12px;">
            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="small">Ver perfil en GitHub</a>
            <span style="float:right" class="small">Última actualización: ${new Date(user.updated_at).toLocaleDateString()}</span>
          </div>
        `;
      } catch (err) {
        console.error(err);
        root.innerHTML = `<div class="small" style="color:#b00020">Error cargando datos: ${err.message}</div>`;
      }
    }

    render();

    