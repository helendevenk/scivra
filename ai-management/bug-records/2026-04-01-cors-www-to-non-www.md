# Bug Analysis Report: CORS-001

## 1. Problem Description

### Symptoms
- Login fails silently on `www.scivra.com`
- Console shows CORS policy errors when authenticating
- Sign-in button becomes disabled after failed attempt

### Impact Assessment
- **Severity**: P0 (Critical)
- **User Impact**: 100% of users accessing via `www.scivra.com` cannot log in
- **Business Impact**: Blocks all subscription conversions, blocks admin access

### Affected Components
- `/sign-in` page
- `/api/auth/sign-in/email` endpoint
- `/api/auth/get-session` endpoint
- All authenticated routes

### Reproduction Steps
1. Navigate to `https://www.scivra.com/sign-in`
2. Enter valid credentials (email + password)
3. Click "Sign In"
4. Observe: button becomes disabled, no error message shown
5. Check console: CORS errors

## 2. Investigation Process

### Initial Hypothesis
Authentication API failing due to CORS misconfiguration between www and non-www domains.

### Debugging Steps Taken
1. Used gstack browse to navigate to login page
2. Filled credentials and submitted form
3. Captured console errors via `$B console --errors`
4. Analyzed network requests via `$B network`

### Evidence Collected

**Console Errors:**
```
[error] Access to fetch at 'https://scivra.com/api/auth/get-session' from origin 'https://www.scivra.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

[error] Access to fetch at 'https://scivra.com/api/auth/sign-in/email' from origin 'https://www.scivra.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.
```

**Network Analysis:**
- `POST https://scivra.com/api/auth/sign-in/email` → pending (never completes)
- `GET https://scivra.com/api/auth/get-session` → pending (never completes)
- Client is on `https://www.scivra.com/sign-in`
- API requests go to `https://scivra.com/api/auth/*` (without www)

### Root Cause
The client-side code makes requests to `scivra.com` (non-www) but the page is served from `www.scivra.com`. This is a cross-origin request that requires proper CORS headers.

**Two issues:**
1. **Redirect during preflight**: The server redirects `www.scivra.com/api/*` to `scivra.com/api/*`, but CORS preflight requests cannot be redirected
2. **Missing CORS headers**: Even if redirect didn't happen, `scivra.com` doesn't return `Access-Control-Allow-Origin: https://www.scivra.com`

## 3. Root Cause Analysis

### Primary Cause
The authentication configuration has `NEXT_PUBLIC_APP_URL` set to `https://scivra.com` (without www), but users access via `https://www.scivra.com`. Better Auth client uses `NEXT_PUBLIC_APP_URL` for API endpoints, causing cross-origin requests.

### Contributing Factors
1. **DNS/Hosting**: Both `scivra.com` and `www.scivra.com` are active but not properly unified
2. **Vercel config**: No redirect rule to consolidate www vs non-www
3. **Better Auth config**: Not configured to handle both origins

### Why Not Caught Earlier
- Local development uses `localhost:3000` - no www prefix
- Production testing may have used non-www URL directly
- No E2E test covers www subdomain login flow

## 4. Solution Design

### Proposed Fix Approach
**Option A (Recommended): Redirect www to non-www**
- Configure Vercel to redirect all `www.scivra.com/*` to `scivra.com/*`
- Single canonical URL, no CORS issues
- SEO benefit (canonical URL)

**Option B: Configure CORS for both origins**
- Add both origins to Better Auth CORS config
- More complex, requires maintaining both domains
- Potential cookie/session issues

### Code Changes Required

**Option A (vercel.json):**
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.scivra.com" }],
      "destination": "https://scivra.com/:path*",
      "permanent": true
    }
  ]
}
```

**Option B (Better Auth config):**
```typescript
// src/core/auth/index.ts
export const auth = betterAuth({
  // ... existing config
  cors: {
    origins: [
      "https://scivra.com",
      "https://www.scivra.com"
    ],
    credentials: true
  }
})
```

### Testing Requirements
1. Test login from `www.scivra.com` → should redirect to `scivra.com` and succeed
2. Test login from `scivra.com` directly → should work
3. Verify session persistence after redirect
4. E2E test for www subdomain

### Rollback Plan
If Option A causes issues:
1. Revert vercel.json redirect
2. DNS: Set www CNAME to point to non-www with redirect at DNS level

## 5. Implementation Details

### Files to Modify
- `vercel.json` (Option A) - add redirect rule
- OR `src/core/auth/index.ts` (Option B) - add CORS origins
- `tests/e2e/auth.spec.ts` - add www subdomain test

### Step-by-Step Fix Process (Option A - Recommended)
1. Add redirect rule to `vercel.json`
2. Deploy to Vercel
3. Clear browser cache and test login from www URL
4. Verify redirect works (301 permanent)
5. Add E2E test case

### Verification Methods
```bash
# Test redirect
curl -I https://www.scivra.com/sign-in
# Should return 301 with Location: https://scivra.com/sign-in

# Test login after fix
pnpm test:e2e -- --grep "login"
```

### Performance Impact
- Minimal: Single 301 redirect before page load
- Actually improves SEO by consolidating canonical URL

## 6. Preventive Measures

### Process Improvements
1. Add E2E test that explicitly tests `www.scivra.com` login
2. Add pre-deploy checklist item: "Test both www and non-www URLs"
3. Document canonical URL in project docs

### Monitoring Additions
1. Vercel Analytics: Alert on CORS errors
2. Sentry: Track authentication failures by origin

### Code Review Focus Areas
- Any changes to `vercel.json` redirects
- Better Auth configuration changes
- Environment variable changes affecting URLs

### Testing Enhancements
```typescript
// tests/e2e/auth.spec.ts - Add this test
test('login via www subdomain redirects to non-www', async ({ page }) => {
  await page.goto('https://www.scivra.com/sign-in');
  await expect(page).toHaveURL(/scivra\.com\/sign-in/); // no www
  // ... rest of login test
});
```

## 7. Lessons Learned

### What Went Well
- Browser testing tool (gstack browse) quickly identified CORS errors
- Network tab clearly showed the origin mismatch

### What Could Improve
- Need automated testing for production URLs, not just localhost
- CI should validate CORS configuration

### Knowledge to Share
- Always consolidate www vs non-www at infrastructure level
- Better Auth uses `NEXT_PUBLIC_APP_URL` for client-side API calls
- CORS preflight requests cannot be redirected

### Future Recommendations
1. Document canonical URL choice early in project
2. Add subdomain testing to E2E suite
3. Consider adding `X-Forwarded-Host` validation in auth middleware

---

## Test Results Summary

| Test Item | Status | Notes |
|-----------|--------|-------|
| Login (www.scivra.com) | FAIL | CORS error |
| Login (scivra.com) | NOT TESTED | Redirects to www |
| Labs Page (/labs/physics) | PASS | 92 experiments, thumbnails load |
| Pricing Page (/pricing) | PASS | All prices display correctly |
| Admin (/admin/settings/payment) | REDIRECT | Correctly redirects to login |

### Screenshots
- `test-screenshots/01-login-cors-error.png` - Login page with CORS error
- `test-screenshots/02-labs-physics-layout.png` - Labs page (working)
- `test-screenshots/03-pricing-page.png` - Pricing page (working)

---

**Date:** 2026-04-01
**Reporter:** QA Agent
**Status:** BLOCKED - Requires infrastructure fix (vercel.json or Better Auth config)
**Priority:** P0 - Critical
