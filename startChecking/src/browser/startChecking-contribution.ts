import { injectable } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { StartCheckingWidget } from './startChecking-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';

export const StartCheckingCommand: Command = { id: 'startChecking:command' };

@injectable()
export class StartCheckingContribution extends AbstractViewContribution<StartCheckingWidget> {

    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     * 
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor() {
        super({
            widgetId: StartCheckingWidget.ID,
            widgetName: StartCheckingWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: StartCheckingCommand.id
        });
    }

    /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param registry
     */
    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(StartCheckingCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
        // Register VS Code command
        registry.registerCommand({
            id: 'checking-extension.currentEditorTabs', // VS Code command ID
            label: 'Updated Editor Tabs'
        }, {
            execute: (jsonData: string) => {
                console.log(`checking-extension.currentEditorTabs - VS Code Updated Editor Tabs`, jsonData);
                try {
                    const editorData = JSON.parse(jsonData);
                    console.log(`checking-extension.currentEditorTabs - VS Code Updated Editor Tabs`, editorData);
                    registry.executeCommand('startingChecking.updateWidgetEditorInfo', editorData);
                } catch (e) {
                    console.error(`checking-extension.currentEditorTabs - data parse error`, e);
                }
                // Your implementation here
                return true;
            }
        });
    }

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
