import { useEffect, useState } from 'react';
import UserCard from './components/UserCard';
import type { GithubUser } from './types/github';

export default function App() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // pas de recherche si pas de texte
    if (!query.trim()) {
      setUsers([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    // petit debounce "simple" pour éviter d'appeler à chaque frappe
    const timer = setTimeout(async () => {
      const q = query; // 👈 on "fige" la valeur actuelle

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error(`GitHub API error (${res.status})`);

        const data: { items: GithubUser[] } = await res.json();
        if (!ignore) setUsers(data.items);
      } catch (e) {
        // si c'est un abort, on ignore / on log (au choix) ->  ce n'est PAS une vraie erreur
        if (e instanceof DOMException && e.name === 'AbortError') return;
        if (!ignore) {
          setUsers([]);
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 400);

    return () => {
      ignore = true; // ✅ interdit à l'ancienne requête de toucher l'état
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1>GitHub User Search</h1>

      <label style={{ display: 'block', marginTop: 16 }}>
        Username:
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ex: gaeron"
          style={{
            display: 'block',
            width: '100%',
            padding: 10,
            marginTop: 8,
            fontSize: 16,
          }}
        />
      </label>

      <div style={{ marginTop: 16 }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {!loading && !error && users.length > 0 && (
          <p>{users.slice(0, 10).length} résultats affichés.</p>
        )}
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
          {users.slice(0, 10).map((u) => (
            <UserCard
              key={u.id}
              login={u.login}
              avatarUrl={u.avatar_url}
              htmlUrl={u.html_url}
              linkLabel="Voir le profil GitHub →"
            />
          ))}
        </ul>

        {!loading && !error && query.trim() && users.length === 0 && (
          <p>No results.</p>
        )}
      </div>
    </main>
  );
}
