import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing.js';
import { describe, beforeEach, it, expect } from 'vitest';
import { type Tree, readProjectConfiguration } from '@nx/devkit';

import { NewPackageGenerator } from './new-package.ts';
import type { BunLibGeneratorSchema } from './schema.js';

describe.only('new-package generator', () => {
    let tree: Tree;
    const options: BunLibGeneratorSchema = {
        name: 'test',
        directory: 'packages/test',
    };

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should have correct configuration', async () => {
        await NewPackageGenerator(tree, options);

        const config = readProjectConfiguration(tree, '@rd/test');

        expect(config).toBeDefined();
        expect(config.root).toBe('packages/test');
        expect(config.name).toBe('@rd/test');
    });

    it('should create readme with package name as heading', async () => {
        await NewPackageGenerator(tree, options);

        const hasReadme = tree.exists('packages/test/README.md');
        expect(hasReadme).toBeTruthy();

        const content = tree.read('packages/test/README.md', 'utf-8');
        expect(content).toContain('# test');
    });
});
