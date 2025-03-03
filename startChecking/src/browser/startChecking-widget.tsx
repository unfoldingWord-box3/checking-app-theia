import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';
import { DefaultFileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { URI } from '@theia/core/lib/common/uri';
import {MetadataAlert} from "../MetadataAlertDialog";
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables';
import { OpenerService } from '@theia/core/lib/browser';

@injectable()
export class StartCheckingWidget extends ReactWidget {

    static readonly ID = 'startChecking:widget';
    static readonly LABEL = 'Start Checking';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(DefaultFileDialogService)
    protected readonly fileDialogService!: DefaultFileDialogService;

    @inject(FileService) // Inject FileService here
    protected readonly fileService!: FileService;

    @inject(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer

    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    @inject(OpenerService)
    protected readonly openerService!: OpenerService;

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
        const homeDir = await this.getHomeFolder()
        const relativePath = 'translationCore/otherProjects';
        const absolutePath = `${homeDir}/${relativePath}`; // Construct absolute path
        const fileUri = new URI(absolutePath);      // Convert the absolute path to a URI
        let defaultFolder;

        try {
            defaultFolder = await this.fileService.resolve(fileUri);
            console.log(`FileStat: for ${absolutePath}`, defaultFolder);
        } catch (error) {
            console.error(`Error fetching FileStat for ${absolutePath}:`, error);
        }

        const props: OpenFileDialogProps = {
            canSelectFolders: true,
            canSelectFiles: false,
            title: 'Select a Folder'
        };
        
        let validWorkspace = false;
        
        const folderUri = await this.fileDialogService.showOpenDialog(props, defaultFolder);
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

    protected async getHomeFolder(): Promise<string | undefined> {
        let homePath = await this.envVariablesServer.getValue('HOME'); // Works on Linux/macOS
        // For Windows, use 'USERPROFILE'
        let userHome = homePath?.value 
        if (!userHome) {
            homePath = await this.envVariablesServer.getValue('USERPROFILE');
            userHome = homePath?.value
        }

        if (userHome) {
            console.log('User Home Folder:', userHome);
            return userHome
        } else {
            console.error('Could not determine user home directory.');
        }
        return undefined;
    }

    protected async createNewProject(): Promise<void> {
        this.messageService.info('createNewProject');
        const home = await this.getHomeFolder()
        const folderPath = new URI(`${home}/translationCore/otherProjects/EMPTY`);

        // Ensure the folder exists
        let folderExists = false;
        try {
            const folderStat = await this.fileService.resolve(folderPath);

            folderExists = folderStat.isDirectory
            if (!folderExists) {
                console.error(`Path exists but is not a directory: ${folderPath.path.toString()}`);
            }
        } catch (error) {
            // Folder doesn't exist, so create it
            try {
                await this.fileService.createFolder(folderPath);
                console.log(`Folder created at: ${folderPath}`);
                folderExists = true;
            } catch (createError) {
                console.error(`Failed to create folder at: ${folderPath.path.toString()}`, createError);
            }
        }

        if (folderExists) {
            console.log('Folder verified and/or created successfully!');
            
            try {
                const fileUri = new URI(`${folderPath}/empty.twl_check`);
                const emptyJson = '{ }';
                await this.fileService.write(fileUri, emptyJson);
                console.log(`File written successfully at: ${fileUri.path}`);
                
                try {
                    // Open a new tab to view the file
                    await this.openerService.getOpener(fileUri).then(opener => opener.open(fileUri));
                    console.log(`File opened in a new tab: ${fileUri.path}`);
                } catch (error) {
                    console.error(`Failed to open file in a new tab: ${fileUri.path}`, error);
                }
            } catch (error) {
                console.error(`Failed to write file at: ${folderPath}/check.txt`, error);
            }
        }
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('displayMessageButton');
        if (htmlElement) {
            htmlElement.focus();
        }
    }
}
