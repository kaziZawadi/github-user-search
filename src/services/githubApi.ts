import type { GithubUser } from '../types/github';

async function searchGithubUsers(params: {
  query: string;
  signal: AbortSignal;
}): Promise<GithubUser[]> {
  const res = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(params.query)}`,

    { signal: params.signal },
  );

  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status})`);
  }

  const data: { items: GithubUser[] } = await res.json();

  return data.items;
}

export default searchGithubUsers;
