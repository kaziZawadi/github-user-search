type UserCardProps = {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  linkLabel: string;
};

function UserCard({ login, avatarUrl, htmlUrl, linkLabel }: UserCardProps) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <img
        src={avatarUrl}
        alt={login}
        width={48}
        height={48}
        style={{ borderRadius: 999 }}
      />
      <div>
        <a href={htmlUrl} target="_blank" rel="noreferrer">
          {login}
        </a>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
            {linkLabel}
          </a>
        </div>
      </div>
    </li>
  );
}

export default UserCard;
