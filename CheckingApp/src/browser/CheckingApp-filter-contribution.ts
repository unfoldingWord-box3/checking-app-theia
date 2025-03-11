import { FilterContribution, ContributionFilterRegistry } from '@theia/core/lib/common';
import { injectable } from 'inversify';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { TaskFrontendContribution } from '@theia/task/lib/browser/task-frontend-contribution';

/**
 * The CheckingAppFilterContribution class is responsible for defining and registering
 * contribution filters that determine which contributions should be filtered out
 * or included in the application.
 *
 * This specific implementation prevents contributions of types TerminalFrontendContribution
 * and TaskFrontendContribution from being registered.
 *
 * Implements the FilterContribution interface to leverage the ability to define and apply
 * custom filters to contributions.
 *
 * Method:
 * - registerContributionFilters: Registers a set of filters to exclude specific contribution types.
 *
 * See Also:
 * - FilterContribution interface
 */
@injectable()
export class CheckingAppFilterContribution implements FilterContribution {

    registerContributionFilters(registry: ContributionFilterRegistry): void {
        registry.addFilters('*', [
            contrib => !(contrib instanceof TerminalFrontendContribution) && !(contrib instanceof TaskFrontendContribution)
        ]);
    }
}