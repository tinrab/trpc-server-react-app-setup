import { trpc, trpcUtils } from '@/app/lib/trpc';
import { useState } from 'react';

export function App() {
  const version = trpc.getVersion.useQuery();
  const messages = trpc.chat.listMessages.useQuery({ roomId: '1' });
  const postMessage = trpc.chat.postMessage.useMutation();
  const [message, setMessage] = useState('');

  const handlePostMessage = () => {
    postMessage.mutate(
      { roomId: '1', message },
      {
        onSuccess: () => {
          trpcUtils.chat.invalidate();
        },
      },
    );
    setMessage('');
  };

  if (version.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>App v{version.data}</h1>

      <h2>Messages</h2>
      <ul>
        {messages.data?.map((message) => (
          <li key={message.roomId}>{message.message}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" onClick={handlePostMessage}>
          Post
        </button>
      </div>
    </div>
  );
}
