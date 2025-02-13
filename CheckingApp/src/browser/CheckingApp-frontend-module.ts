/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { CheckingAppContribution } from './CheckingApp-contribution';


export default new ContainerModule(bind => {

    // Replace this line with the desired binding, e.g. "bind(CommandContribution).to(CheckingAppContribution)
    bind(CheckingAppContribution).toSelf();
});
