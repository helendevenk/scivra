import { canAccessAdmin } from '@/core/rbac/permission';
import { getAllConfigs } from '@/shared/models/config';
import { getSignUser } from '@/shared/models/user';
import { getPaymentService } from '@/shared/services/payment';

// Admin-only readonly diagnostic. Returns the active Stripe mode + whether
// runtime env vars are overriding DB config (Vercel env > DB precedence).
// Cache-Control: no-store so we never see a stale response when the admin
// just rotated keys.
export async function GET() {
  const user = await getSignUser();
  if (!user) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  const allowed = await canAccessAdmin(user.id);
  if (!allowed) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  const configs = await getAllConfigs();
  const paymentService = await getPaymentService();
  const stripeProvider = paymentService.getProvider('stripe');

  const detectMode = (
    key: string | undefined,
    livePrefix: string,
    testPrefix: string
  ) => {
    if (!key) return '(unset)';
    if (key.startsWith(livePrefix)) return 'live';
    if (key.startsWith(testPrefix)) return 'test';
    return '(unknown)';
  };

  return Response.json(
    {
      stripe_enabled: configs.stripe_enabled,
      stripe_checkout_enabled: configs.stripe_checkout_enabled ?? '(unset)',
      stripe_checkout_mode: configs.stripe_checkout_mode ?? '(unset)',
      stripe_secret_key_mode: detectMode(
        configs.stripe_secret_key,
        'sk_live_',
        'sk_test_'
      ),
      stripe_publishable_key_mode: detectMode(
        configs.stripe_publishable_key,
        'pk_live_',
        'pk_test_'
      ),
      stripe_signing_secret_set: !!configs.stripe_signing_secret,
      stripe_provider_registered: !!stripeProvider,
      env_override: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'set' : '(unset)',
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
          ? 'set'
          : '(unset)',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
          ? 'set'
          : '(unset)',
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
