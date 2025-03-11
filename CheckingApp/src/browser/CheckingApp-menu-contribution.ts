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
            "2_workspace",
            "3_save",
            "4_autosave",
            "4_downloadupload",
            "5_settings",

            // from "2_edit"
            "3_find",

            // from "4_views": 
            "0_primary",
            "1_appearance",
            "4_toggle"
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

            // from "4_views": [
            "callhierarchy:toggle",
            "debug:toggle",
            "debug:console:toggle",
            // "fileNavigator:toggle",
            "outlineView:toggle",
            "output:toggle",
            "pluginsView:toggle",
            "problemsView:toggle",
            "search-in-workspace.toggle",
            "scmView:toggle",
            "typehierarchy:toggle"
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
//         },
//     "4_view": {
//         "0_primary",
//         "1_appearance",
//         "2_views": [
//             "callhierarchy:toggle",
//             "debug:toggle",
//             "debug:console:toggle",
//             "fileNavigator:toggle",
//             "outlineView:toggle",
//             "output:toggle",
//             "pluginsView:toggle",
//             "problemsView:toggle",
//             "search-in-workspace.toggle",
//             "scmView:toggle",
//             "typehierarchy:toggle"
//         ],
//         "4_toggle"
//     }
//
//     "9_help": []
// }
