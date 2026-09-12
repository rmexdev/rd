import { type Result, ok, err } from '@rd/core/result';
import { againstNullOrUndefinedBulk, type GuardErr } from '@rd/core/guard';
import { Entity } from '@rd/core/domain';
import type { ProjectName } from './project-name.vo.ts';

export type ProjectProps = {
    nextActions: Array<string>;
};

export type ProjectResult = Result<Project, GuardErr>;

export class Project extends Entity<ProjectProps> {
    static create(props: ProjectProps, name: ProjectName): ProjectResult {
        const guardResult = againstNullOrUndefinedBulk([
            { argument: name, argumentName: 'name' },
        ]);
        if (guardResult.isErr) {
            return err(guardResult.err);
        }

        return ok(new Project(props, name));
    }

    private constructor(props: ProjectProps, name: ProjectName) {
        super(props, name);
    }

    get name(): ProjectName {
        return this._id as ProjectName;
    }
}
