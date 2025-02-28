import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileSystem } from '@theia/filesystem/lib/common';

@injectable()
export class StartCheckingWidget extends ReactWidget {

    static readonly ID = 'startChecking:widget';
    static readonly LABEL = 'Start Checking';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(FileDialogService)
    protected readonly fileDialogService!: FileDialogService;

    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    @inject(FileSystem)
    protected readonly fileSystem!: FileSystem;

    @postConstruct()
    protected init(): void {
        this.doInit();
    }

    protected async doInit(): Promise<void> {
        this.id = StartCheckingWidget.ID;
        this.title.label = StartCheckingWidget.LABEL;
        this.title.caption = StartCheckingWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    render(): React.ReactElement {
        const header = `You have not selected a project for checking. Either select an existing checking project or create a new one.`;
        return <div id='widget-container'>
            <AlertMessage type='INFO' header={header} />
            <button id='selectProjectButton' className='theia-button secondary' title='Select Existing Project' onClick={_a => this.selectExistingProject()}>Select Existing Project</button>
            <button id='newProjectButton' className='theia-button secondary' title='Create New Project' onClick={_a => this.createNewProject()}>Create New Project</button>
        </div>;
    }

    protected async selectExistingProject(): Promise<void> {
        const homeDirUri = await this.fileSystem.getCurrentUserHome();
        const defaultUri = homeDirUri?.resolve('projects');

        const props: OpenFileDialogProps = {
            canSelectFolders: true,
            canSelectFiles: false,
            title: 'Select a Folder',
            defaultUri
        };
        const folderUri = await this.fileDialogService.showOpenDialog(props);
        if (folderUri) {
            this.messageService.info('Selected folder: ' + folderUri.path.toString());
            await this.workspaceService.open(folderUri);
            this.messageService.info('Workspace opened: ' + folderUri.path.toString());
        } else {
            this.messageService.info('No folder selected.');
        }
    }

    protected createNewProject(): void {
        this.messageService.info('createNewProject');
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('displayMessageButton');
        if (htmlElement) {
            htmlElement.focus();
        }
    }
}
