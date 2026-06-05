# File Structure Refactoring Plan: Squad → Trueworth-Inspired Architecture

## Current State Analysis

Your Next.js project uses:
- **App Router** with route segments in `src/app/(dashboard)/`
- **Flat component structure** in `src/components/`
- **Centralized utilities** in `src/lib/`

**Issues:**
- ❌ No feature-based component organization
- ❌ API logic mixed with utilities
- ❌ No dedicated hooks folder
- ❌ No data/constants layer separation
- ❌ Single lib folder conflates concerns

---

## Target Architecture

Adapt Trueworth's domain-driven structure to work with Next.js app router:

```
src/
├── app/                          # Next.js App Router (keep routes here)
│   ├── layout.tsx
│   ├── globals.css
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── airdrops/
│       ├── leaderboard/
│       ├── profile/
│       ├── tasks/
│       ├── wallet/
│       └── [other routes]/
│
├── components/                   # Feature-based component organization
│   ├── auth/
│   │   ├── TelegramProvider.tsx
│   │   └── TelegramAuthGuard.tsx (if needed)
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── MetricsGrid.tsx
│   │   └── StatusCard.tsx
│   ├── airdrops/
│   │   ├── AirdropCard.tsx
│   │   ├── AirdropDetailView.tsx
│   │   └── AirdropSecurityBadge.tsx
│   ├── wallet/
│   │   ├── WalletSummaryCard.tsx
│   │   ├── ApprovalsList.tsx
│   │   └── HealthScore.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskProgressBar.tsx
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx
│   │   ├── LeaderboardEntry.tsx
│   │   └── RankingBadge.tsx
│   ├── profile/
│   │   ├── ProfileCard.tsx
│   │   ├── WalletStatus.tsx
│   │   └── ReferralCodeDisplay.tsx
│   ├── shared/
│   │   ├── AppShell.tsx
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── primitives/
│       ├── GuardPrimitives.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── [other base components]/
│
├── hooks/                        # Custom React hooks
│   ├── useTelegramSession.ts    (extract from TelegramProvider)
│   ├── useDashboardData.ts      (wrapper for getDashboardData)
│   ├── useWalletAnalysis.ts
│   ├── useAirdropDetail.ts
│   ├── useTaskActions.ts        (for updateTask, etc)
│   ├── useScrollPosition.ts     (from scroll.ts)
│   └── useAnimationPresets.ts   (from motion.ts)
│
├── services/                     # API & business logic
│   ├── api/
│   │   ├── client.ts            (apiRequest wrapper)
│   │   ├── auth.ts              (authenticateTelegram, etc)
│   │   ├── user.ts              (getUser, attachWallet, etc)
│   │   ├── airdrops.ts          (getAirdrops, getAirdropById, analyzeAirdrop)
│   │   ├── wallet.ts            (analyzeWallet, etc)
│   │   ├── tasks.ts             (getUserTasks, updateTask, ensureChecklist)
│   │   ├── gamification.ts      (getLeaderboard, grantXp, etc)
│   │   ├── referrals.ts         (getReferrals)
│   │   ├── crypto.ts            (getCoinPrice, getTrendingCoins)
│   │   ├── notifications.ts     (sendNotification)
│   │   ├── health.ts            (getHealth)
│   │   └── index.ts             (re-export all)
│   └── business/
│       ├── auth.ts              (authentication logic)
│       ├── wallet.ts            (wallet connection logic)
│       └── gamification.ts      (XP calculations, etc)
│
├── data/                         # Constants & mock data
│   ├── constants.ts             (API_BASE_URL, SESSION_STORAGE_KEY, DEMO_USER_ID)
│   ├── mock/
│   │   ├── airdrops.ts          (fallbackAirdrops)
│   │   ├── leaderboard.ts       (fallbackLeaderboard)
│   │   ├── tasks.ts             (fallbackTasks)
│   │   ├── trending.ts          (fallbackTrending)
│   │   ├── referrals.ts         (fallbackReferrals)
│   │   ├── walletAnalysis.ts    (fallbackWalletAnalysis)
│   │   ├── securityReport.ts    (fallbackSecurityReport)
│   │   └── index.ts             (re-export all)
│   └── navigation.ts            (navigation configuration)
│
├── types/                        # Centralized TypeScript definitions
│   ├── index.ts
│   ├── api.ts                   (API response types)
│   ├── domain.ts                (User, Airdrop, Task, etc)
│   ├── ui.ts                    (UI-specific types)
│   └── common.ts                (Common types, enums)
│
├── lib/                          # Shared library utilities
│   ├── utils.ts                 (formatDate, prettifyLabel, getHostnameFromUrl)
│   └── helpers.ts               (generic helpers)
│
├── providers/                    # React context & providers
│   ├── TelegramSessionProvider.tsx (moved from components)
│   └── index.tsx
│
├── utils/                        # Feature-specific utilities
│   ├── formatting.ts
│   ├── validation.ts
│   └── transform.ts
```

---

## Migration Steps

### Phase 1: Create New Folder Structure
```bash
mkdir -p src/{hooks,services/{api,business},data/{mock},providers,utils}
```

### Phase 2: Reorganize Components
**Move & rename:**
- `components/TelegramProvider.tsx` → `providers/TelegramSessionProvider.tsx`
- `components/GuardPrimitives.tsx` → `components/primitives/GuardPrimitives.tsx` (split into individual components)
- `components/AppShell.tsx` → `components/shared/AppShell.tsx`
- Create feature folders:
  - `components/dashboard/` - dashboard-related UI
  - `components/airdrops/` - airdrop-specific components
  - `components/wallet/` - wallet-related components
  - `components/tasks/` - task-related components
  - `components/leaderboard/` - leaderboard-specific components
  - `components/profile/` - profile-related components

### Phase 3: Extract API Logic to Services
**Split `src/lib/api.ts` into `src/services/api/`:**
- `auth.ts` - `authenticateTelegram()`
- `user.ts` - `getUser()`, `attachWallet()`, `getUserStats()`
- `airdrops.ts` - `getAirdrops()`, `getAirdropById()`, `analyzeAirdrop()`
- `wallet.ts` - `analyzeWallet()`
- `tasks.ts` - `getUserTasks()`, `updateTask()`, `ensureChecklist()`
- `gamification.ts` - `getLeaderboard()`, `grantXp()`
- `referrals.ts` - `getReferrals()`
- `crypto.ts` - `getCoinPrice()`, `getTrendingCoins()`
- `notifications.ts` - `sendNotification()`
- `health.ts` - `getHealth()`
- `client.ts` - `apiRequest()` wrapper, `ApiError` class

### Phase 4: Organize Data Layer
**Move `src/lib/demo.ts` to `src/data/mock/`:**
- `src/data/mock/airdrops.ts` - `fallbackAirdrops`
- `src/data/mock/leaderboard.ts` - `fallbackLeaderboard`
- `src/data/mock/tasks.ts` - `fallbackTasks`
- `src/data/mock/trending.ts` - `fallbackTrending`
- `src/data/mock/referrals.ts` - `fallbackReferrals`
- `src/data/mock/walletAnalysis.ts` - `fallbackWalletAnalysis`
- `src/data/mock/securityReport.ts` - `fallbackSecurityReport`

**Move constants:**
- `src/lib/constants.ts` → `src/data/constants.ts`
- `src/lib/navigation.ts` → `src/data/navigation.ts`

### Phase 5: Create Custom Hooks
**Extract logic into `src/hooks/`:**
- `useTelegramSession.ts` - Auth logic from TelegramProvider
- `useDashboardData.ts` - Aggregation wrapper
- `useWalletAnalysis.ts` - Wallet analysis flow
- `useAirdropDetail.ts` - Airdrop detail loading
- `useTaskActions.ts` - Task CRUD operations
- `useScrollPosition.ts` - From `src/lib/scroll.ts`
- `useAnimationPresets.ts` - From `src/lib/motion.ts`

### Phase 6: Reorganize Types
**Consolidate in `src/types/`:**
- `api.ts` - All API response/request types
- `domain.ts` - Core domain types (User, Airdrop, Task, etc)
- `ui.ts` - UI component prop types
- `common.ts` - Shared enums/utilities

### Phase 7: Create Providers
**Move context to dedicated folder:**
- `src/providers/TelegramSessionProvider.tsx` (from components)
- `src/providers/index.tsx` (compose providers)

### Phase 8: Update Imports
Update all imports across the app to point to new locations.

---

## Import Path Examples

### Before
```typescript
import { getUser, getAirdrops } from "@/lib/api";
import { fallbackAirdrops } from "@/lib/demo";
import { API_BASE_URL } from "@/lib/constants";
import { TelegramProvider } from "@/components/TelegramProvider";
import { GuardPrimitives } from "@/components/GuardPrimitives";
```

### After
```typescript
import { getUser } from "@/services/api/user";
import { getAirdrops } from "@/services/api/airdrops";
import { fallbackAirdrops } from "@/data/mock/airdrops";
import { API_BASE_URL } from "@/data/constants";
import { TelegramSessionProvider } from "@/providers";
import { Button, Card, Badge } from "@/components/primitives";
import { AirdropCard } from "@/components/airdrops";
```

---

## Benefits of This Structure

✅ **Feature-based organization** - Related components, services, hooks together  
✅ **Clear separation of concerns** - API, business logic, UI all distinct layers  
✅ **Scalability** - Adding new features is just creating a new feature folder  
✅ **Maintainability** - Easy to find related code  
✅ **Testability** - Services and hooks are isolated and easier to test  
✅ **Consistency** - Aligns with industry standards (Trueworth pattern)  
✅ **Code splitting** - Services can be lazy-loaded if needed  

---

## Priority

1. **High**: Services reorganization (biggest impact on maintainability)
2. **High**: Components into features (clarity)
3. **Medium**: Hooks extraction (reusability)
4. **Medium**: Data layer organization (constants/mocks separation)
5. **Low**: Types consolidation (already well-organized)

---

## Estimated Impact

- **Files to create**: ~25-30
- **Files to move**: ~8-10
- **Files to refactor**: ~15-20 (import updates)
- **Time**: 2-3 hours (including testing)
