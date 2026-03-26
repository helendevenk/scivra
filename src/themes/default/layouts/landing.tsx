import { ReactNode } from 'react';

import { FaceProvider } from '@/shared/blocks/common/face-provider';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';
import { Footer, Header } from '@/themes/default/blocks';

export default async function LandingLayout({
  children,
  header,
  footer,
}: {
  children: ReactNode;
  header: HeaderType;
  footer: FooterType;
}) {
  return (
    <FaceProvider>
      <div className="min-h-screen w-full">
        <Header header={header} />
        {children}
        <Footer footer={footer} />
      </div>
    </FaceProvider>
  );
}
