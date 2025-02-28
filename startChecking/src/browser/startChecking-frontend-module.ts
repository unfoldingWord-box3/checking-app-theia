import { ContainerModule } from '@theia/core/shared/inversify';
import { StartCheckingWidget } from './startChecking-widget';
import { StartCheckingContribution } from './startChecking-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, StartCheckingContribution);
    bind(FrontendApplicationContribution).toService(StartCheckingContribution);
    bind(StartCheckingWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: StartCheckingWidget.ID,
        createWidget: () => ctx.container.get<StartCheckingWidget>(StartCheckingWidget)
    })).inSingletonScope();
});
