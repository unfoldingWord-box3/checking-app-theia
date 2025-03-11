/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { CheckingAppContribution } from './CheckingApp-contribution';
import {CheckingAppFilterContribution} from "./CheckingApp-filter-contribution";
import {FilterContribution} from "@theia/core/lib/common";
import {CheckingAppMenuContribution} from "./CheckingApp-menu-contribution";
import {MenuContribution} from "@theia/core";


export default new ContainerModule(bind => {
    bind(FilterContribution).to(CheckingAppFilterContribution).inSingletonScope();
    bind(MenuContribution).to(CheckingAppMenuContribution).inSingletonScope();
    bind(CheckingAppContribution).toSelf();
});
