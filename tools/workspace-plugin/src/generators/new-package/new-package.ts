import {
    formatFiles,
    generateFiles,
    installPackagesTask,
    type Tree,
} from '@nx/devkit';
import * as path from 'path';
import type { LibGeneratorSchema } from './schema.js';
import { libraryGenerator } from '@nx/js';

export async function NewPackageGenerator(
    tree: Tree,
    options: LibGeneratorSchema,
) {

    const projectRoot = `${options.directory}`;
    const folderName = projectRoot.slice(projectRoot.lastIndexOf('/') + 1);
    options.name = folderName;

    await libraryGenerator(tree, {
        name: options.name,
        directory: projectRoot,
        bundler: 'none',
        linter: 'eslint',
        unitTestRunner: 'none',
    });

    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);

    const projectJsonPath = `${projectRoot}/project.json`;
    if (tree.exists(projectJsonPath)) {
        tree.delete(projectJsonPath);
    }

    await formatFiles(tree);

    return () => {
        installPackagesTask(tree, true, '.', 'pnpm');
    }
}

export default NewPackageGenerator;
