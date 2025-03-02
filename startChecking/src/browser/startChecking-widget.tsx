import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
// import { FileUri } from '@theia/core/lib/node';
import { URI } from '@theia/core/lib/common/uri';
import {MetadataAlert} from "../MetadataAlertDialog";

@injectable()
export class StartCheckingWidget extends ReactWidget {

    static readonly ID = 'startChecking:widget';
    static readonly LABEL = 'Start Checking';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(FileDialogService)
    protected readonly fileDialogService!: FileDialogService;

    @inject(FileService) // Inject FileService here
    protected readonly fileService!: FileService;
    
    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

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

    protected async readMetadata(workspaceUri:URI): Promise<any> {
        try {
            const metadataUri = new URI(`${workspaceUri}/metadata.json`);
            console.log('metadataUri:', metadataUri);

            // Read the contents of metadata.json
            const fileContent = await this.fileService.read(metadataUri);
            const jsonData = JSON.parse(fileContent.value); // Parse JSON

            console.log('Metadata content:', jsonData);
            return jsonData;
        } catch (error) {
            console.error('Failed to read metadata.json:', error);
            return null;
        }
    }
    
    protected async readFileAsText(fileUri: URI): Promise<string> {
        try {
            // Use FileService to read the file content
            const fileContent = await this.fileService.read(fileUri);
            console.log('fileContent:', fileContent);
            // File content is inside the `value` property as a string
            return fileContent.value;
        } catch (error) {
            console.error(`Failed to read file at URI: ${fileUri.toString()}`, error);
            throw new Error(`Could not read the file: ${error.message}`);
        }
    }

    protected async selectExistingProject(): Promise<void> {
        const props: OpenFileDialogProps = {
            canSelectFolders: true,
            canSelectFiles: false,
            title: 'Select a Folder',
            // TODO: this doesn't work:
            // // @ts-ignore
            // inputValue: '~/translationCore/otherProjects'
        };
        
        let validWorkspace = false;
        
        const folderUri = await this.fileDialogService.showOpenDialog(props);
        if (folderUri) {
            console.log(`selectExistingProject() Selected folder: `, folderUri.path)
            this.messageService.info('Selected folder: ' + folderUri.path.toString());
            try {
                const metaData = await this.readMetadata(folderUri)
                if (metaData) {
                    const checkerData = metaData?.['translation.checker'];
                    if (checkerData) {
                        console.log(`selectExistingProject() metaData: `, metaData)
                        const relativeCheckPath = `${checkerData?.twl_checksPath}/${checkerData?.bookId}.twl_check`;
                        const checkFileUri = folderUri.resolve(relativeCheckPath);
                        console.log(`selectExistingProject() checkFileUri: `, checkFileUri.path)
                        const checkData = await this.readFileAsText(checkFileUri)
                        validWorkspace = checkData?.length > 0; // just make sure there is content
                        if (validWorkspace) {
                            await this.workspaceService.open(folderUri);
                            this.messageService.info('Workspace opened: ' + folderUri.path.toString());
                        } else {
                            console.log(`${checkFileUri.path.toString()} is not valid checkData`, checkData)
                        }
                    }
                } else {
                    this.messageService.info('No metadata.json found.');
                }
            } catch (e) {
                this.messageService.info(`Not a project folder: ${folderUri.path.toString()}`);
            }
            
            if (!validWorkspace) {
                const metadataAlert = new MetadataAlert();
                const message = `"${folderUri.path.toString()}" is not a checking project folder!`
                metadataAlert.showModal(message);
            }
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
