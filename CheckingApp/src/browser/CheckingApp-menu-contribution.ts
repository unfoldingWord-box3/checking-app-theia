import { injectable } from 'inversify';
import { MenuContribution, MenuModelRegistry } from '@theia/core';

@injectable()
export class CheckingAppMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        const removeMenuNodes = [
            '3_selection',
            '5_go',
            '6_debug',

            // from "1_file"
            "3_save",
            "4_autosave",
            "4_downloadupload",
            "5_settings",
        ]
        // drop menus
        removeMenuNodes.forEach(id => {
            menus.unregisterMenuNode(id);
        })

        const removeMenuActions = [
            // from "1_new_text"
            "workbench.action.files.newUntitledFile",
            "workbench.action.files.pickNewFile",
            "file.newFolder",

            // from "2_open": 
            "workspace:open",
            "workspace:openWorkspace",
        ]
        // drop menus
        removeMenuActions.forEach(id => {
            menus.unregisterMenuAction(id);
        })
    }
}

// const menuItems = {
//     "1_file": [
//         "1_new_text": [
//             "workbench.action.files.newUntitledFile",
//             "workbench.action.files.pickNewFile",
//             "file.newFolder",
//             "workbench.action.newWindow"
//         ],
//         "2_open": [
//             "workspace:open",
//             "workspace:openWorkspace",
//             "workspace:openRecent"
//         ],
//         "2_workspace": [
//             "workspace:addFolder",
//             "workspace:saveAs"
//         ],
//
//         "3_save",
//         "4_autosave",
//         "4_downloadupload",
//         "5_settings",
//         "6_close": [
//             "core.close.main.tab",
//             "workspace:close"
//         ]
//     ],
//     "2_edit":
//         {
//             "1_undo",
//             "2_clipboard"
//             :
//                 [
//                     "core.cut",
//                     "core.copy",
//                     "core.paste",
//                     "core.copy.path",
//                     "file.copyDownloadLink"
//                 ],
//             "3_find"
//             :
//                 [
//                     "core.find",
//                     "core.replace",
//                     "search-in-workspace.open",
//                     "search-in-workspace.replace"
//                 ]
//         }
//     ],
//     "9_help": []
// }
