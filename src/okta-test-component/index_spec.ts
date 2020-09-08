import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { mergeMap } from 'rxjs/operators';
import * as path from 'path';

describe('okta-test-component', () => {

  const collectionPath = path.join(__dirname, '../collection.json');
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    path.join(__dirname, './../collection.json'),
  );

  const workspaceOptions: any = { 
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '0.5.0',
  };

  const appOptions: any = { 
    name: 'schematest'
  };

  const schemaOptions: any = { 
    name: 'foo'
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    schematicRunner.runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions).pipe(
      mergeMap((tree) => schematicRunner.runExternalSchematicAsync('@schematics/angular', 'application', appOptions, tree))
    ).subscribe((res) => {
      appTree = res
    });
  });

  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematicAsync('okta-test-component', schemaOptions, appTree).toPromise().then(tree => {
      const appComponent = tree.readContent('/projects/schematest/src/app/app.component.ts'); 
      expect(appComponent).toContain(`name = '${schemaOptions.name}'`); 
    });
  });
});
