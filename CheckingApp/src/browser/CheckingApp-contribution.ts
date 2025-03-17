import { injectable, inject } from 'inversify';
import { FrontendApplicationContribution, ApplicationShell } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { EditorManager } from '@theia/editor/lib/browser';
import { DisposableCollection } from '@theia/core';

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
    protected readonly toDispose = new DisposableCollection();

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    @inject(ApplicationShell)
    protected readonly applicationShell: ApplicationShell;

    @inject(EditorManager)
    protected readonly editorManager: EditorManager;


    // If you need more details about each tab
    protected getLeftSidebarTabs(): Array<{ id: string, label: string }> {
        const leftArea = this.applicationShell.leftPanelHandler;
        const tabBar = leftArea.tabBar;

        return tabBar.titles.map(title => ({
            id: title.owner.id,
            label: title.label
        }));
    }

    protected async removeLeftSidebarTabs(removeTabs: string[]): Promise<void> {
        const leftArea = this.applicationShell.leftPanelHandler;

        // Get all widgets in the left area
        const widgets = leftArea.tabBar.titles.map(title => title.owner);

        // Remove each widget that matches the removeTabs list
        for (const widget of widgets) {
            if (removeTabs.includes(widget.id)) {
                widget.dispose();
            }
        }

        // Ensure the shell updates
        await this.applicationShell.pendingUpdates;
    }

    protected getDetailedOpenEditors(): Array<{
        uri: string,
        title: string,
        isDirty: boolean,
        isActive: boolean
    }> {
        const activeEditor = this.editorManager.activeEditor;

        return this.editorManager.all.map(editor => ({
            // @ts-ignore
            uri: editor.uri.toString(),
            title: editor.title.label,
            // @ts-ignore
            isDirty: editor.dirty,
            isActive: editor === activeEditor
        }));
    }

    protected setupEditorTracking(): void {
        // Listen for active widget changes in the shell
        this.toDispose.push(
            this.applicationShell.onDidChangeActiveWidget(async () => {
                const activeEditor = this.editorManager.activeEditor;
                if (activeEditor) {
                    console.log('Active editor changed:', activeEditor.title.label);
                } else {
                    console.log('No active editor');
                }
            })
        );

        // Listen for all widgets added or removed in the shell
        this.toDispose.push(
            this.applicationShell.onDidAddWidget(() => {
                const openEditors = this.getDetailedOpenEditors();
                console.log('onDidAddWidget - Updated list of open editors:', openEditors);
            })
        );
        this.toDispose.push(
            this.applicationShell.onDidRemoveWidget(() => {
                const openEditors = this.getDetailedOpenEditors();
                console.log('onDidRemoveWidget - Updated list of open editors:', openEditors);
            })
        );
    }

    // Add cleanup when the contribution is stopped
    onStop(): void {
        this.toDispose.dispose();
    }

    /**
     * Initializes the layout when the application starts.
     * This method is invoked after the application shell is ready.
     * It removes unwanted tabs from the left sidebar, collapses the panel if a workspace is selected,
     * or opens and activates the start checking widget if no workspace is selected.
     *
     * @return {Promise<void>} A promise that resolves once the layout initialization is completed.
     */
    async onDidInitializeLayout(): Promise<void> {
        console.log('CheckingAppContribution.onDidInitializeLayout()');

        // Setup editor tracking
        // this.setupEditorTracking(); // TODO this breaks editor startup
        
        // Wait for the shell to be ready
        await this.applicationShell.pendingUpdates;

        const tabs = this.getLeftSidebarTabs();
        console.log('CheckingAppContribution.onDidInitializeLayout() - Tabs: ', tabs);

        const removeTabs = [
            // "explorer-view-container",
            "search-view-container",
            "scm-view-container",
            "debug",
            "test-view-container"
        ]

        // Remove unwanted tabs
        await this.removeLeftSidebarTabs(removeTabs);

        if (this.workspaceService.opened) {
            console.log('CheckingAppContribution.onDidInitializeLayout() - A workspace is selected.');
            // Collapse the left area (where explorer is located)
            await this.applicationShell.collapsePanel('left');
        } else {
            console.log('CheckingAppContribution.onDidInitializeLayout() - No workspace selected - opening start checking widget.');
            const widget = await this.widgetManager.getOrCreateWidget('startChecking:widget');
            await this.applicationShell.addWidget(widget, { area: 'main' });
            await this.applicationShell.activateWidget(widget.id);
        }
    }
}
