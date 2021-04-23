import fs from 'node:fs';
import license from 'rollup-plugin-license';

function generateLicenseFile(dependencies) {
  const coreLicense = fs.readFileSync('LICENSE-CORE.md');
  const licenses = new Set();
  const dependencyLicenseTexts = dependencies
    .sort(({ name: nameA }, { name: nameB }) => (nameA > nameB ? 1 : -1))
    .map(
      ({
        name,
        license,
        licenseText,
        author,
        maintainers,
        contributors,
        repository,
      }) => {
        let text = `## ${name}\n`;
        if (license) {
          text += `License: ${license}\n`;
        }

        const names = new Set();
        if (author && author.name) {
          names.add(author.name);
        }

        for (const person of [...maintainers, contributors]) {
          if (person && person.name) {
            names.add(person.name);
          }
        }

        if (names.size > 0) {
          text += `By: ${[...names].join(', ')}\n`;
        }

        if (repository) {
          text += `Repository: ${repository.url || repository}\n`;
        }

        if (licenseText) {
          text += `\n${licenseText
            .trim()
            .replace(/(\r\n|\r)/gm, '\n')
            .split('\n')
            .map((line) => `> ${line}`)
            .join('\n')}\n`;
        }

        licenses.add(license);
        return text;
      }
    )
    .join('\n---------------------------------------\n\n');
  const licenseText =
    `${
      `# Rollup core license\n` +
      `Rollup is released under the MIT license:\n\n`
    }${coreLicense}\n# Licenses of bundled dependencies\n` +
    `The published Rollup artifact additionally contains code with the following licenses:\n` +
    `${[...licenses].join(', ')}\n\n` +
    `# Bundled dependencies:\n${dependencyLicenseTexts}`;
  const existingLicenseText = fs.readFileSync('LICENSE.md', 'utf8');
  if (existingLicenseText !== licenseText) {
    fs.writeFileSync('LICENSE.md', licenseText);
    console.warn('LICENSE.md updated. You should commit the updated file.');
  }
}

export default function getLicenseHandler() {
  const licenses = new Map();
  function addLicenses(dependencies) {
    for (const dependency of dependencies) {
      licenses.set(dependency.name, dependency);
    }
  }

  return {
    collectLicenses() {
      return license({ thirdParty: addLicenses });
    },
    writeLicense() {
      return {
        writeBundle() {
          generateLicenseFile([...licenses.values()]);
        },
      };
    },
  };
}
