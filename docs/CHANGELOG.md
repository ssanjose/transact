# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Initial project setup with basic structure.
- Implemented `Account` and `Transaction` interfaces in [src/lib/db/db.model.ts](src/lib/db/db.model.ts).
- Created `Page` component in [src/app/transaction/page.tsx](src/app/transaction/page.tsx).
- Added `createAppliedTransaction` function in [src/hooks/appliedTransaction.controller.ts](src/hooks/appliedTransaction.controller.ts).

### Changed
- Updated `Home` component in [src/app/page.tsx](src/app/page.tsx) to include account creation form.
- Modified `updateTransactionAndAppliedTransactions` function in [src/hooks/transaction.controller.ts](src/hooks/transaction.controller.ts) to handle batch operations.

### Fixed
- Fixed issue with `updateAccount` function in [src/hooks/account.controller.ts](src/hooks/account.controller.ts) not updating the account balance correctly.

### Updated Today
- Added `categoryId` field to `Transaction` interface in [src/lib/db/db.model.ts](src/lib/db/db.model.ts).
- Improved error handling in `deleteCategory` function in [src/hooks/category.controller.ts](src/hooks/category.controller.ts).

### Docs Folder Changes
- Updated `docs/architecture/system_architecture.md` to include new database schema changes.
- Added new section in `docs/design/software_design.md` for the updated `Transaction` module.
- Revised `docs/conventions/coding_conventions.md` to document new error handling improvements.
- Updated `docs/style/style_guide.md` to ensure new `categoryId` field in `Transaction` interface follows the same formatting conventions.

## [Unreleased] - 2024-10-01
### Added
- Initial release with basic functionality for managing accounts and transactions.

## [Unreleased] - 2024-10-15
### Added
- Added category management with `CategoryController` in [src/hooks/category.controller.ts](src/hooks/category.controller.ts).

### Changed
- Improved error handling in controllers and propagated errors to the view layer for display.

### Fixed
- Fixed issue with `createAppliedTransaction` function not returning the correct ID.

## [Unreleased] - 2024-10-20
### Added
- Added support for transaction frequency and type in [src/lib/db/db.model.ts](src/lib/db/db.model.ts).

### Changed
- Refactored `updateTransaction` function in [src/hooks/transaction.controller.ts](src/hooks/transaction.controller.ts) to handle frequency changes.

### Fixed
- Fixed issue with `getCategories` function in [src/lib/category.ts](src/lib/category.ts) not returning correct data.

## [Unreleased] - 2024-10-25
### Added
- Added `getMonthlyData` and `getFinanceData` utility functions in [src/lib/utils.ts](src/lib/utils.ts).

### Changed
- Updated `RootLayout` component in [src/app/layout.tsx](src/app/layout.tsx) to include global styles.

### Fixed
- Fixed issue with `updateAppliedTransaction` function in [src/hooks/appliedTransaction.controller.ts](src/hooks/appliedTransaction.controller.ts) not updating the applied transactions correctly.

## [Unreleased] - 2024-10-30
### Added
- Added new validation rules for `Account`, `Transaction`, and `Category` in [src/lib/db/db.model.ts](src/lib/db/db.model.ts).

### Changed
- Improved performance of `updateTransactionAndAppliedTransactions` function in [src/hooks/transaction.controller.ts](src/hooks/transaction.controller.ts).

### Fixed
- Fixed issue with `createAccount` function in [src/hooks/account.controller.ts](src/hooks/account.controller.ts) not creating accounts correctly.

## [Unreleased] - 2024-11-01
### Added
- Added new features for managing applied transactions in [src/hooks/appliedTransaction.controller.ts](src/hooks/appliedTransaction.controller.ts).

### Changed
- Updated `Home` component in [src/app/page.tsx](src/app/page.tsx) to display account balances correctly.

### Fixed
- Fixed issue with `updateCategory` function in [src/hooks/category.controller.ts](src/hooks/category.controller.ts) not updating categories correctly.

## [Unreleased] - 2024-11-15
### Added
- Added `categoryId` field to `Transaction` interface in [src/lib/db/db.model.ts](src/lib/db/db.model.ts).
- Added Enums for `TransactionType` and `Frequency` in [src/lib/db/db.model.ts](src/lib/db/db.model.ts) for improved type checking.
- Added `manuallyUpdated` boolean to `AppliedTransaction` interface in [src/lib/db/db.model.ts](src/lib/db/db.model.ts) to persist manual changes to individual `AppliedTransactions`.

### Changed
- Improved error handling in `deleteCategory` function in [src/hooks/category.controller.ts](src/hooks/category.controller.ts).
- Updated `updateTransaction` function in [src/hooks/transaction.controller.ts](src/hooks/transaction.controller.ts) to make it more efficient at spotting created, updated, or deleted `AppliedTransaction` to save time and resources.
- Adjusted `updateTransaction` function in [src/hooks/transaction.controller.ts](src/hooks/transaction.controller.ts) to persist manual changes to `AppliedTransactions` via a user prompt.

## [Unreleased] - 2024-11-20
### Added
- Created `formatCurrency` utility function in [src/lib/format/formatCurrency.ts](src/lib/format/formatCurrency.ts).
- Added JSDoc comments to `formatCurrency` function.
- Added account balance formatting in `Home` component using `formatCurrency`.

### Changed
- Refactored `Home` component in [src/app/page.tsx](src/app/page.tsx) to use `useLiveQuery` from `AccountController.getAllAccounts()` for automatic tracking of accounts.
- Updated `Home` component to format account balances using `formatCurrency`.

### Discussion
- Decided to use Balsamiq for wireframes.

## [Unreleased] - 2024-11-20
### Added
- Integrated shadcn/ui for UI components in the project.
- Created `components.json` for shadcn/ui configuration.

