
import { ConfirmDialog } from '@theia/core/lib/browser/dialogs';

// ### Explanation:
//
// 1. **`ConfirmDialog` Class**:
//    The `ConfirmDialog` is a built-in dialog widget in Theia that creates modal alerts with various levels of customization.
//
// 2. **Dialog Options**:
//    - **`title`**: Title of the modal dialog.
//    - **`msg`**: The main message content visible in the modal.
//    - **`ok`**: The button label for dismissing the dialog, which replaces `Confirm/Cancel` if only one button is needed.
//
// 3. **`dialog.open()`**:
//    The modal dialog opens and waits for user interaction. In this case, clicking **OK** dismisses the alert.
//
// ---
//
// ### Usage Example:
// ```typescript
// const metadataAlert = new MetadataAlert();
// metadataAlert.showModal();
// ```
//
// When this code is invoked, a modal dialog with the message `"No metadata.json found."` will appear, requiring the user to acknowledge it by clicking **OK**.
//
// If you need help adding other enhanced modal features, let me know!

export class MetadataAlert {
    async showModal(msg: string): Promise<void> {
        // Create and show a modal dialog
        const dialog = new ConfirmDialog({
            title: 'Alert',  // Modal title
            msg: msg,        // Content message passed as a property
            ok: 'OK'         // Button label for acknowledgment
        });

        // Display the modal
        await dialog.open();
    }
}
