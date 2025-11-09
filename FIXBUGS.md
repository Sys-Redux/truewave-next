# Areas to Improve

- When a user deletes their account from the Profile UI, I do not see an explicit Firestore deletion of the user's document or their orders; only Firebase Auth deleteUser() is called.

-No visible client-side flow to remove associated order documents or other user-specific Firestore data as part of account deletion (required by assignment).

- Account deletion may require reauthentication; while the code handles the auth/recent-login error, the data-cleanup step is missing and could leave orphaned records.

## Suggested Next Steps

- On account deletion, explicitly remove the user's Firestore document (e.g., users/{uid}) and any user-scoped data such as orders. Prefer a transactional or batched delete (or server-side Cloud Function) to ensure all related records are removed.

- If deleting many dependent records (orders), consider a Cloud Function or background job to perform safe cascade deletes and avoid client timeouts; document the behavior in README.

- Add a confirmation step that indicates which data will be removed, and reauthenticate the user before proceeding to delete sensitive data to satisfy Firebase requirements.

- Add unit/integration test notes or scripts to validate product/order CRUD flows and the data-cleanup behavior after account deletion.

-Document security rules for Firestore that enforce that users can only read/write their own orders and that only admins can manage products/orders in the admin UI.
