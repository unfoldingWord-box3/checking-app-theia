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
import {CommandRegistry} from "@theia/core/lib/common/command";
import { CommandService } from '@theia/core/lib/common/command';

/**
 * wraps timer in a Promise to make an async function that continues after a specific number of milliseconds.
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
export function delay(ms:number) {
    return new Promise((resolve) =>
        setTimeout(resolve, ms)
    );
}

/**
 * The `StartCheckingWidget` class is a React-based widget that is used to prompt the user
 * to either select an existing project or create a new one for "checking" operations.
 *
 * It leverages Theia framework's dependency injection and provides a GUI for managing projects.
 */
@injectable()
export class StartCheckingWidget extends ReactWidget {
    // Unique ID for the widget.
    static readonly ID = 'startChecking:widget';
    // Visible label for the widget.
    static readonly LABEL = 'Start Checking';

    // these variables are updated by widget component
    protected updateEditorTabsCallback: any = undefined;
    protected updateEditorCurrentCount: number = 0;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    // Message service for displaying alerts, notifications, or feedback to the user.
    @inject(MessageService)
    protected readonly messageService!: MessageService;

    // Service for displaying file dialogs (e.g., open file dialog).
    @inject(DefaultFileDialogService)
    protected readonly fileDialogService!: DefaultFileDialogService;

    // Service for performing file operations (e.g., reading, writing files).
    @inject(FileService)
    protected readonly fileService!: FileService;

    // Provides access to environment variables.
    @inject(EnvVariablesServer)
    protected readonly envVariablesServer: EnvVariablesServer;

    // Handles workspace-related operations, such as retrieving workspace URIs.
    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    // Service for opening resources in appropriate editors.
    @inject(OpenerService)
    protected readonly openerService!: OpenerService;

    // inject the CommandRegistry
    @inject(CommandRegistry)
    protected readonly commandRegistry: CommandRegistry;
    
    /**
     * Initializes the widget after its construction using the `@postConstruct` lifecycle hook.
     * Calls the `doInit` method to configure widget properties.
     */
    @postConstruct()
    protected init(): void {
        this.doInit();
    }
    
    /**
     * Configures the basic properties of the widget, such as its ID, label, caption,
     * and initial state.
     */
    protected async doInit(): Promise<void> {
        this.id = StartCheckingWidget.ID; // Assigns a unique ID to the widget.
        this.title.label = StartCheckingWidget.LABEL; // Sets the widget label.
        this.title.caption = StartCheckingWidget.LABEL; // Sets the widget tooltip caption.
        this.title.closable = true; // Allows the widget to be closed by the user.
        this.title.iconClass = 'fa fa-external-link'; // Sets an icon class for the widget header.

        // Register command handlers
        this.registerCommandHandlers();

        this.update(); // Updates the UI to reflect any changes.

        delay(4000).then(async () => {
            try {
                console.log(`starting checking-extension.listEditorTabs`)
                await this.executeVSCodeCommand("checking-extension.listEditorTabs")
                console.log('checking-extension.listEditorTabs finished')
            } catch (e) {
                console.error(`checking-extension.listEditorTabs error:`, e)
            }
        })
    }

    protected getCheckingTabCount(editorData: object[]): number {
        let count = 0;
        for (const editor of editorData) {
            // @ts-ignore
            const label = editor.label;
            if (label.includes('.tn_check') || label.includes('.twl_check')) {
                count++;
            }
        }
        return count;
    }

    protected registerCommandHandlers(): void {
        // Create a disposable for the command handler
        const disposable = this.commandService.onDidExecuteCommand(e => {
            // TRICKY: not sure why, but message is being forwarded to widget as checking-extension.currentEditorTabs rather than startingChecking.updateWidgetEditorInfo, so for now we handle both
            if ((e.commandId === 'startingChecking.updateWidgetEditorInfo' || e.commandId === 'checking-extension.currentEditorTabs')
                    && e.args) {
                console.log('startingChecking.updateWidgetEditorInfo', e.args)
                try {
                    const editorData = JSON.parse(e.args[0]);
                    console.log('startingChecking.updateWidgetEditorInfo editors', editorData)
                    const editorCount = this.getCheckingTabCount(editorData);
                    console.log('startingChecking.updateWidgetEditorInfo editorCount', editorCount)
                    if (this.updateEditorCurrentCount != editorCount) { // if editor tab count has changed, then update
                        const setEditorCount = this.updateEditorTabsCallback;
                        setEditorCount && setEditorCount(editorCount)
                    }
                } catch (e) {
                    console.error('startingChecking.updateWidgetEditorInfo error:', e)
                }
            }
        });

        // Make sure to clean up when widget is disposed
        this.toDispose.push(disposable);
    }

    /**
     * Renders the React-based content for the widget.
     * This includes a message prompting the user to select or create a project,
     * along with the associated buttons.
     *
     * @returns {React.ReactElement} The rendered UI.
     */
    render(): React.ReactElement {
        return <this.WidgetContent projectSelected={this.workspaceService.opened}/>;
    }

    /**
     * WidgetContent is a React functional component that renders a widget
     * for managing project-related actions such as selecting an existing project,
     * creating a new one, or performing checks on translation resources if a project is selected.
     *
     * @typedef {Object} Props
     * @property {boolean} projectSelected - Indicates whether a project has been selected.
     *
     * @component
     * @param {Props} props - The properties passed to the component.
     * @returns {JSX.Element} Returns the rendered JSX element for the widget content.
     */
    protected WidgetContent: React.FC<{ projectSelected: boolean }> = ({projectSelected}) => {
        const header = `You have not selected a project for checking. Either select an existing checking project or create a new one.`;
        const projectSelected_ = projectSelected

        const [ editorCount, setEditorCount ] =  React.useState(0);
        const noEditorOpen = projectSelected_ && !(editorCount > 0);
        
        this.updateEditorTabsCallback = setEditorCount
        this.updateEditorCurrentCount = editorCount
        
        return (
            <div id="widget-container">
                <AlertMessage type="INFO" header={header} />
                <hr/>
                <button
                    id="selectProjectButton"
                    className="theia-button secondary"
                    title="Select Existing Project"
                    onClick={() => this.selectExistingProject()}
                >
                    Select Existing Project
                </button>
                <hr/>
                <button
                    id="newProjectButton"
                    className="theia-button secondary"
                    title="Create New Project"
                    onClick={() => this.createNewProject()}
                >
                    Create New Project
                </button>
                { noEditorOpen && (
                    <>
                        <hr/>
                        <button
                            id="openTnotesButton"
                            className="theia-button secondary"
                            title="Check translationNotes"
                            onClick={() => this.executeVSCodeCommand("checking-extension.checkTNotes")}
                        >
                            Check translationNotes
                        </button>
                        <hr/>
                        <button
                            id="openTwordsButton"
                            className="theia-button secondary"
                            title="Check translationWords"
                            onClick={() => this.executeVSCodeCommand("checking-extension.checkTWords")}
                        >
                            Check translationWords
                        </button>
                    </>
                )}
            </div>
        );
    };


// Then you can execute the command
    protected async executeVSCodeCommand(command: string): Promise<void> {
        try {
            console.log('executeVSCodeCommand:', command);
            // Execute the command by its ID
            await this.commandRegistry.executeCommand(command);
        } catch (error) {
            console.error('executeVSCodeCommand: Failed to execute command:', error);
        }
    }

    /**
     * Reads the metadata information from a `metadata.json` file located in the provided workspace URI.
     *
     * @param workspaceUri - The URI of the workspace to read metadata from.
     * @returns {Promise<any>} A promise resolving to the metadata as a JSON object, or null on failure.
     */
    protected async readMetadata(workspaceUri: URI): Promise<any> {
        try {
            const metadataUri = workspaceUri.resolve('metadata.json');
            console.log('metadataUri:', metadataUri);

            // Read the contents of metadata.json
            const fileContent = await this.fileService.read(metadataUri);
            const jsonData = JSON.parse(fileContent.value); // Parse JSON
            console.log('Metadata content:', jsonData);
            return jsonData;
        } catch (error) {
            console.error('Failed to read metadata.json:', error);
            return null; // Return null if metadata could not be read.
        }
    }

    /**
     * Reads the file content of the specified URI and returns it as a string.
     *
     * @param fileUri - The URI of the file to read.
     * @returns {Promise<string>} A promise resolving to the text content of the file.
     * @throws Will throw an error if the file cannot be read.
     */
    protected async readFileAsText(fileUri: URI): Promise<string> {
        try {
            // Use FileService to read the file content
            const fileContent = await this.fileService.read(fileUri);
            console.log('fileContent:', fileContent);
            // File content is returned inside the `value` property as a string.
            return fileContent.value;
        } catch (error) {
            console.error(`Failed to read file at URI: ${fileUri.toString()}`, error);
            throw new Error(`Could not read the file: ${error.message}`);
        }
    }
    
    /**
     * Prompts the user to select an existing project folder, validates the folder as a checking project, and opens it as a workspace.
     * It ensures the selected folder contains valid metadata and necessary project files.
     *
     * @return {Promise<void>} A promise that resolves after the folder has been processed and, if valid, added as the current workspace.
     */
    protected async selectExistingProject(): Promise<void> {
        const homeDir = await this.getHomeFolder()
        let defaultFolder

        if (!homeDir) {
            console.error('Could not determine users home directory');
            this.messageService.error('Could not determine users home directory');
            return;
        }

        const relativePath = 'translationCore/otherProjects';
        // Example with URI path utilities:
        const fileUri = new URI(homeDir).resolve(relativePath);

        try {
            defaultFolder = await this.fileService.resolve(fileUri);
            console.log(`FileStat: for ${fileUri.path}`, defaultFolder);
        } catch (error) {
            console.error(`Error fetching FileStat for ${fileUri.path}:`, error);
            
            try {
                defaultFolder = await this.fileService.resolve(new URI(homeDir));
                console.log(`FileStat: for ${fileUri.path}`, defaultFolder);
            } catch (error) {
                console.error(`Error fetching FileStat for ${fileUri.path}:`, error);
            }
        }

        if (!homeDir) {
            console.error('Could not determine default directory');
            this.messageService.error('Could not determine default directory');
            return;
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
                        validWorkspace = checkData?.length > 10; // just make sure there is content
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

    /**
     * Retrieves the home folder path of the current user by checking the system environment variables.
     * First, it attempts to fetch the 'HOME' variable (Linux/macOS).
     * If not found, it checks for the 'USERPROFILE' variable (Windows).
     *
     * @return {Promise<string | undefined>} A promise that resolves to the user's home folder path as a string,
     * or undefined if the path could not be determined.
     */
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
    
    /**
     * This is used to display to open the checking-tool-extension UI on an empty project.
     *  This in turn will walk user through process of creating a new checking project
     *  
     * Creates a new project directory and an empty JSON file within it. If the directory
     * does not exist, it is created. An empty JSON file is generated within the directory
     * and a new tab is opened to display the file. If the directory already exists but
     * is not a folder, an error is logged.
     *
     * @return {Promise<void>} A promise that resolves when the project creation and
     * file write process is completed.
     */
    protected async createNewProject(): Promise<void> {
        this.messageService.info('createNewProject');
        const homeDir = await this.getHomeFolder()
        const folderPath = new URI(homeDir).resolve(`translationCore/otherProjects/EMPTY`);

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
                const fileUri = folderPath.resolve(`empty.twl_check`);
                const emptyJson = '{ }';
                await this.fileService.write(fileUri, emptyJson);
                console.log(`File written successfully at: ${fileUri.path}`);
                
                await this.openFileTab(fileUri);
            } catch (error) {
                console.error(`Failed to write file at: ${folderPath}/check.txt`, error);
            }
        }
    }

    /**
     * Opens a file in a new tab using the provided URI.
     *
     * @param {URI} fileUri - The URI of the file to be opened.
     * @return {Promise<void>} A promise that resolves when the file is successfully opened.
     */
    protected async openFileTab(fileUri: URI): Promise<void> {
        try {
            // Open a new tab to view the file
            await this.openerService.getOpener(fileUri).then(opener => opener.open(fileUri));
            console.log(`File opened in a new tab: ${fileUri.path}`);
        } catch (error) {
            console.error(`Failed to open file in a new tab: ${fileUri.path}`, error);
        }
    }

    /**
     * Handles the activation request for the component.
     * Focuses on the HTML element with the ID 'displayMessageButton' if it exists.
     *
     * @param {Message} msg - The activation message triggering this request.
     * @return {void} This method does not return a value.
     */
    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('displayMessageButton');
        if (htmlElement) {
            htmlElement.focus();
        }
    }
}