import { injectable, inject } from 'inversify';
import { FrontendApplicationContribution, ApplicationShell } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';

/**
 * The `CheckingAppContribution` class implements the `FrontendApplicationContribution` interface
 * to handle the application lifecycle events and provide functionality related to the workspace and widgets.
 * It initializes the application behavior at startup, ensuring proper handling of cases where no workspace is selected.
 *
 * Dependencies:
 * - `WorkspaceService`: Used to check the state of the workspace.
 * - `WidgetManager`: Used to create or retrieve widgets.
 * - `ApplicationShell`: Used to manage the application's UI shell.
 */
@injectable()
export class CheckingAppContribution implements FrontendApplicationContribution {

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    /**
     * Handles the initialization process when the application starts.
     * If no workspace is selected, it creates and opens a widget in the application's main area.
     * Otherwise, logs a message indicating a workspace is selected.
     *
     * @return {Promise<void>} A promise that resolves when the initialization process is completed.
     */
    async onStart(): Promise<void> {

        console.log('CheckingAppContribution.onStart()');
        
        if (!this.workspaceService.opened) {
            console.log('CheckingAppContribution.onStart() - No workspace selected - opening start checking widget.');
            const widget = await this.widgetManager.getOrCreateWidget('startChecking:widget');
            await this.shell.addWidget(widget, { area: 'main' });
            await this.shell.activateWidget(widget.id);
        } else {
            console.log('CheckingAppContribution.onStart() - A workspace is selected.');
        }

        // Wait for the shell to be ready
        await this.shell.pendingUpdates;

        // Collapse the left area (where explorer is located)
        this.shell.collapsePanel('left');
    }
}
