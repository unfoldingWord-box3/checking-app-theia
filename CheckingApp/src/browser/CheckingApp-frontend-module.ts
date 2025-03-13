import { ContainerModule } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { FilterContribution } from "@theia/core/lib/common";
import { CheckingAppContribution } from './CheckingApp-contribution';
import { CheckingAppFilterContribution } from "./CheckingApp-filter-contribution";
import { CheckingAppMenuContribution } from "./CheckingApp-menu-contribution";
import { MenuContribution } from "@theia/core";

export default new ContainerModule(bind => {
    try {
        // Bind the main contribution
        bind(FrontendApplicationContribution)
            .to(CheckingAppContribution)
            .inSingletonScope();
        
        // The filters ensure that specific contribution instances, such as
        // `TerminalFrontendContribution`, `TaskFrontendContribution`,
        // `MonacoFrontendApplicationContribution`, `MonacoOutlineContribution`,
        // `OutlineViewContribution`, and `OutlineViewService`, are excluded.
        bind(FilterContribution).to(CheckingAppFilterContribution).inSingletonScope();

        // remove menu items not needed
        bind(MenuContribution).to(CheckingAppMenuContribution).inSingletonScope();

    } catch (e) {
        console.error(`ContainerModule - binding failed `, e);
    }
});
