import { ChatHistory } from '@/shared/blocks/chat/history';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  noIndex: true,
});

export default function ChatHistoryPage() {
  return <ChatHistory />;
}
