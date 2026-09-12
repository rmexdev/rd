import { describe, expect, it } from 'vitest';
import { getClarifiedItem } from '../inbox/item/item.entity.spec.ts';
import { assertIsOk } from '@rd/core/test';
import { OrganiseService } from './organise.service.ts';
import type { ProjectResult } from '../buckets/project/index.ts';

describe('organise.service', () => {
    it('should convert clarified item to project with clarified content as project name', () => {
        const item = getClarifiedItem();

        const projectOrErr: ProjectResult = OrganiseService.itemToProject(item);

        assertIsOk(projectOrErr);
        expect(item.clarifiedContent.value).toBe(
            projectOrErr.value.name.toString(),
        );
    });
});
