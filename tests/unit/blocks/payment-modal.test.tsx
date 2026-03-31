import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({ locale: 'en' })),
}));
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
}));

const mockSetIsShowPaymentModal = vi.fn();
vi.mock('@/shared/contexts/app', () => ({
  useAppContext: vi.fn(() => ({
    isShowPaymentModal: true,
    setIsShowPaymentModal: mockSetIsShowPaymentModal,
    configs: {},
  })),
}));

let mockIsDesktop = true;
vi.mock('@/shared/hooks/use-media-query', () => ({
  useMediaQuery: vi.fn(() => mockIsDesktop),
}));

vi.mock('@/shared/blocks/payment/payment-providers', () => ({
  PaymentProviders: ({ pricingItem, onCheckout }: any) => (
    <div data-testid="payment-providers">
      {pricingItem?.title && <span>{pricingItem.title}</span>}
      <button onClick={() => onCheckout(pricingItem, 'stripe')}>checkout</button>
    </div>
  ),
}));

import { render, fireEvent, within } from '@testing-library/react';
import { PaymentModal } from '@/shared/blocks/payment/payment-modal';

const basePricingItem = {
  title: 'Pro Plan',
  description: 'Professional access',
  currency: 'USD',
  amount: 499,
  price: '$4.99',
  interval: 'month' as const,
  product_id: 'prod_test_001',
};

// Dialog/Drawer render via portal to document.body, so we query from body
function queryBody() {
  return within(document.body);
}

describe('PaymentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsDesktop = true;
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', () => {
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByText('choose_payment_method')).toBeDefined();
  });

  it('should show dialog title and description on desktop', () => {
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByText('choose_payment_method')).toBeDefined();
    expect(queryBody().getByText('choose_payment_method_description')).toBeDefined();
  });

  it('should render PaymentProviders component', () => {
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByTestId('payment-providers')).toBeDefined();
  });

  it('should pass pricingItem to PaymentProviders', () => {
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByText('Pro Plan')).toBeDefined();
  });

  it('should call onCheckout when provider is selected', () => {
    const onCheckout = vi.fn();
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={onCheckout} />
    );
    fireEvent.click(queryBody().getByText('checkout'));
    expect(onCheckout).toHaveBeenCalledWith(basePricingItem, 'stripe');
  });

  it('should render drawer on mobile', () => {
    mockIsDesktop = false;
    render(
      <PaymentModal isLoading={false} pricingItem={basePricingItem} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByText('choose_payment_method')).toBeDefined();
    expect(queryBody().getByText('cancel_title')).toBeDefined();
  });

  it('should handle null pricingItem gracefully', () => {
    render(
      <PaymentModal isLoading={false} pricingItem={null} onCheckout={vi.fn()} />
    );
    expect(queryBody().getByText('choose_payment_method')).toBeDefined();
  });
});
