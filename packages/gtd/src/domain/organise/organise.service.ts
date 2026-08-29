import type { Item } from '../inbox/index.ts';
import {
    Project,
    ProjectName,
    type ProjectProps,
    type ProjectResult,
} from '../buckets/project/index.ts';

export class OrganiseService {
    private constructor() {
        throw new Error('Not implemented! Static class');
    }

    static itemToProject(item: Item): ProjectResult {
        if (!item.isClarified())
            const projectNameOrErr = ProjectName.create(
                item.clarifiedContent.value,
            );
        if (projectNameOrErr.isErr) return projectNameOrErr;

        const projectProps: ProjectProps = {
            nextActions: [],
        };

        const projectOrErr: ProjectResult = Project.create(
            projectProps,
            projectNameOrErr.value,
        );

        return projectOrErr;
    }
}
