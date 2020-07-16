import ExternalModule from '../ExternalModule';
import Module from '../Module';
import relativeId from './relativeId';

interface OrderedExecutionUnit {
  execIndex: number;
}

const compareExecIndex = <T extends OrderedExecutionUnit>(unitA: T, unitB: T) =>
  unitA.execIndex > unitB.execIndex ? 1 : -1;

export function sortByExecutionOrder(units: OrderedExecutionUnit[]) {
  units.sort(compareExecIndex);
}

export function analyseModuleExecution(entryModules: Module[]) {
  let nextExecIndex = 0;
  const cyclePaths: string[][] = [];
  const analysedModules = new Set<Module | ExternalModule>();
  const dynamicImports = new Set<Module>();
  const parents = new Map<Module | ExternalModule, Module | null>();
  const orderedModules: Module[] = [];

  const analyseModule = (module: Module | ExternalModule) => {
    if (module instanceof Module) {
      for (const dependency of module.dependencies) {
        if (parents.has(dependency)) {
          if (!analysedModules.has(dependency)) {
            cyclePaths.push(getCyclePath(dependency, module, parents));
          }

          continue;
        }

        parents.set(dependency, module);
        analyseModule(dependency);
      }

      for (const dependency of module.implicitlyLoadedBefore) {
        dynamicImports.add(dependency);
      }

      for (const { resolution } of module.dynamicImports) {
        if (resolution instanceof Module) {
          dynamicImports.add(resolution);
        }
      }

      orderedModules.push(module);
    }

    module.execIndex = nextExecIndex++;
    analysedModules.add(module);
  };

  for (const curEntry of entryModules) {
    if (!parents.has(curEntry)) {
      parents.set(curEntry, null);
      analyseModule(curEntry);
    }
  }

  for (const curEntry of dynamicImports) {
    if (!parents.has(curEntry)) {
      parents.set(curEntry, null);
      analyseModule(curEntry);
    }
  }

  return { orderedModules, cyclePaths };
}

function getCyclePath(
  module: Module | ExternalModule,
  parent: Module,
  parents: Map<Module | ExternalModule, Module | null>
) {
  const path = [relativeId(module.id)];
  let nextModule = parent;
  while (nextModule !== module) {
    path.push(relativeId(nextModule.id));
    nextModule = parents.get(nextModule);
  }

  path.push(path[0]);
  path.reverse();
  return path;
}
