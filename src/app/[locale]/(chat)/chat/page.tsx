import { ChatGenerator } from '@/shared/blocks/chat/generator';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  noIndex: true,
});

export default function ChatPage() {
  return <ChatGenerator />;
}
