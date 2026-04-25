import { getMetadata } from '@/shared/lib/seo';

import ChatPageClient from './ChatPageClient';

export const generateMetadata = getMetadata({
  noIndex: true,
});

export default function ChatPage() {
  return <ChatPageClient />;
}
