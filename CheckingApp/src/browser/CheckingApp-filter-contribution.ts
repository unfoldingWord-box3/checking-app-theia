import { FilterContribution, ContributionFilterRegistry } from '@theia/core/lib/common';
import { injectable } from 'inversify';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { TaskFrontendContribution } from '@theia/task/lib/browser/task-frontend-contribution';
import { MonacoOutlineContribution } from '@theia/monaco/lib/browser/monaco-outline-contribution';
import { OutlineViewContribution } from '@theia/outline-view/lib/browser/outline-view-contribution';
import { OutlineViewService } from '@theia/outline-view/lib/browser/outline-view-service';
import { MonacoFrontendApplicationContribution } from '@theia/monaco/lib/browser/monaco-frontend-application-contribution';

/**
 * A contribution filter implementation that excludes certain contributions
 * from being registered in the application. This is primarily used to apply
 * specific filters during the application initialization process.
 *
 * The `CheckingAppFilterContribution` class implements the `FilterContribution`
 * interface and provides a mechanism to register contribution filters through
 * the provided `ContributionFilterRegistry`.
 *
 * The filters ensure that specific contribution instances, such as
 * `TerminalFrontendContribution`, `TaskFrontendContribution`,
 * `MonacoFrontendApplicationContribution`, `MonacoOutlineContribution`,
 * `OutlineViewContribution`, and `OutlineViewService`, are excluded.
 *
 * Methods:
 * - registerContributionFilters(registry): Registers the defined filters
 *   to be applied during the contribution registration process.
 */
@injectable()
export class CheckingAppFilterContribution implements FilterContribution {

    registerContributionFilters(registry: ContributionFilterRegistry): void {
        registry.addFilters('*', [
            contrib => !(contrib instanceof TerminalFrontendContribution),
            contrib => !(contrib instanceof TaskFrontendContribution),
            contrib => !(contrib instanceof MonacoFrontendApplicationContribution),
            contrib => !(contrib instanceof MonacoOutlineContribution),
            contrib => !(contrib instanceof OutlineViewContribution),
            contrib => !(contrib instanceof OutlineViewService)
        ]);
    }
}