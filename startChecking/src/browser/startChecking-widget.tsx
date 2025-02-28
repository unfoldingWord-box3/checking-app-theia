import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';

@injectable()
export class StartCheckingWidget extends ReactWidget {

    static readonly ID = 'startChecking:widget';
    static readonly LABEL = 'Start Checking';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected init(): void {
        this.doInit()
    }

    protected async doInit(): Promise <void> {
        this.id = StartCheckingWidget.ID;
        this.title.label = StartCheckingWidget.LABEL;
        this.title.caption = StartCheckingWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    render(): React.ReactElement {
        const header = `You have not selected a project for checking. Either select and existing checking project or create a new one`;
        return <div id='widget-container'>
            <AlertMessage type='INFO' header={header} />
            <button id='selectProjectButton' className='theia-button secondary' title='Select Existing Project' onClick={_a => this.selectExistingProject()}>Select Existing Project</button>
            <button id='newProjectButton' className='theia-button secondary' title='Create New Project' onClick={_a => this.createNewProject()}>Create New Project</button>
        </div>
    }

    protected selectExistingProject(): void {
        this.messageService.info('selectExistingProject');
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
