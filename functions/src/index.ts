import {onCall, HttpsError} from 'firebase-functions/v2/https';
import {onDocumentDeleted} from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onUserDeleted = onDocumentDeleted(
  'users/{userId}',
  async (event) => {
    const uid = event.params.userId;
    console.log(`Starting cleanup for deleted user: ${uid}`);

    const db = admin.firestore();

    try {
      // Delete the user from Firebase Auth
      try {
        await admin.auth().deleteUser(uid);
        console.log(`Deleted Firebase Auth user: ${uid}`);
      } catch (authError: unknown) {
        // User might already be deleted from Auth
        console.log(`Auth user already deleted or not found: ${uid}`, authError);
      }

      // Delete User's Shopping Cart
      try {
        await db.collection('carts').doc(uid).delete();
        console.log(`Deleted shopping cart for user: ${uid}`);
      } catch (cartError: unknown) {
        console.log(`Shopping cart already deleted or not found for user: ${uid}`, cartError);
      }

      // Find All Orders Belonging to This User
      const ordersSnapshot = await db
        .collection('orders')
        .where('userId', '==', uid)
        .get();

      if (ordersSnapshot.empty) {
        console.log(`No orders found for UID: ${uid}`);
        return;
      }

      // Delete All User Orders Using Batched Writes
      const batchSize = 500;
      let batch = db.batch();
      let operationCount = 0;
      let totalDeleted = 0;

      for (const orderDoc of ordersSnapshot.docs) {
        batch.delete(orderDoc.ref);
        operationCount++;
        totalDeleted++;

        // Commit The Batch When It Reaches 500 operations
        if (operationCount >= batchSize) {
          await batch.commit();
          console.log(
            `Committed a batch of ${operationCount} deletions for UID: ${uid}`
          );
          batch = db.batch();
          operationCount = 0;
        }
      }

      // Commit Any Remaining Operations In The Batch
      if (operationCount > 0) {
        await batch.commit();
        console.log(
          `Committed final batch of ${operationCount} deletions for UID: ${uid}`
        );
      }

      console.log(
        `Completed cleanup for UID: ${uid}. Total orders deleted: ${totalDeleted}`
      );
    } catch (error) {
      console.error(`Error during cleanup for UID: ${uid}`, error);
    }
  }
);

/**
 * Manual Cleanup Function (Testing or Admin Use) - v2 syntax
 *
 * This callable function allows manual cleanup of user data.
 * Can be called from the client with the Firebase SDK.
 */
export const cleanupUserData = onCall(async (request) => {
  // Ensure the caller is authenticated
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Only allow users to delete their own data (or admins)
  const callerUid = request.auth.uid;
  const targetUid = request.data.uid;

  if (callerUid !== targetUid) {
    // Check if caller is admin
    const callerDoc = await admin
      .firestore()
      .collection('users')
      .doc(callerUid)
      .get();
    const isAdmin = callerDoc.data()?.isAdmin || false;

    if (!isAdmin) {
      throw new HttpsError(
        'permission-denied',
        'You can only delete your own data'
      );
    }
  }

  const db = admin.firestore();

  try {
    // Delete user document
    await db.collection('users').doc(targetUid).delete();

    // Delete Firebase Auth user
    try {
      await admin.auth().deleteUser(targetUid);
    } catch (authError) {
      console.log(`Auth user already deleted: ${targetUid}`);
    }

    // Delete user cart
    try {
      await db.collection('carts').doc(targetUid).delete();
    } catch (cartError) {
      console.log(`Cart already deleted or not found for user: ${targetUid}`);
    }

    // Delete all user orders
    const ordersSnapshot = await db
      .collection('orders')
      .where('userId', '==', targetUid)
      .get();

    const batch = db.batch();
    ordersSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return {
      success: true,
      message: `Cleaned up data for user ${targetUid}`,
      ordersDeleted: ordersSnapshot.size,
      cartsDeleted: true,
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    throw new HttpsError('internal', 'Failed to cleanup user data');
  }
});

export const onProductDeleted = onDocumentDeleted(
  'products/{productId}',
  async (event) => {
    const productId = event.params.productId;
    console.log(`Product deleted: ${productId}. Cleaning up carts...`);

    const db = admin.firestore();

    try {
      // Get all cart documents
      const cartsSnapshot = await db.collection('carts').get();

      if (cartsSnapshot.empty) {
        console.log('No carts found in the database');
        return;
      }

      let cartsUpdated = 0;
      let itemsRemoved = 0;

      // Process each cart
      for (const cartDoc of cartsSnapshot.docs) {
        const cartData = cartDoc.data();
        const items = cartData.items || [];

        // Filter out the deleted product
        const originalLength = items.length;
        const updatedItems = items.filter(
          (item: { product: { id: string }; quantity: number }) =>
            item.product.id !== productId
        );

        // Only update if items were removed
        if (updatedItems.length < originalLength) {
          const removedCount = originalLength - updatedItems.length;
          itemsRemoved += removedCount;
          cartsUpdated++;

          if (updatedItems.length === 0) {
            // Cart is empty after removal - delete the cart document
            await cartDoc.ref.delete();
            console.log(`✅ Deleted empty cart for user: ${cartDoc.id}`);
          } else {
            // Update cart with filtered items
            await cartDoc.ref.update({
              items: updatedItems,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            console.log(
              `✅ Removed ${removedCount} item(s) from cart: ${cartDoc.id}`
            );
          }
        }
      }

      if (cartsUpdated > 0) {
        console.log(
          `✅ Product cleanup complete. Updated ${cartsUpdated} cart(s), removed ${itemsRemoved} item(s)`
        );
      } else {
        console.log('ℹ️  Product was not in any carts');
      }
    } catch (error) {
      console.error(`❌ Error cleaning up carts for product ${productId}:`, error);
      // Don't throw - we don't want to prevent the product deletion
    }
  }
);