import { injectable, inject } from 'inversify';
import { FrontendApplicationContribution, ApplicationShell } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';

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
        if (!this.workspaceService.opened) {
            console.log('CheckingAppContribution - No workspace selected - opening start checking widget.');
            const widget = await this.widgetManager.getOrCreateWidget('startChecking:widget');
            this.shell.addWidget(widget, { area: 'main' });
            this.shell.activateWidget(widget.id);
        } else {
            console.log('CheckingAppContribution - A workspace is selected.');
        }
    }
}
