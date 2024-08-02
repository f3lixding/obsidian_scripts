<%*
const { vault, workspace, metadataCache } = this.app;

if (tp.file.content.length === 0) {
let description = await tp.system.prompt("Enter a brief description to describe the topic:");
tR += `---
is_index: true
description: "${description}"
---	

## Premise
${description}	

`;
}

tR += "## Table of Contents\n";

const activeFile = workspace.getActiveFile();
const containingFolder = activeFile.parent;

let table = `|file link|description|\n|---|---|\n`;

for (const file of containingFolder.children) {
	const md = metadataCache.getFileCache(file);
	if (md && md.frontmatter && md.frontmatter.is_primary) {
		// this means we have a file (and not a folder)
		const link = `[[${file.path}\\|${file.name}]]`;
		const desc = md.frontmatter?.description ?? "No description provided";
		table += `|${link}|${desc}|\n`;
	} else if (!md) {
		// this means we have a subfolder
		for (const child of file.children) {
			if (child.name === "index.md") {
				const childMd = metadataCache.getFileCache(child); 
				const link = `[[${child.path}\\|${file.name}]]`;
				const desc = childMd?.frontmatter?.description ?? "No description provided";
				table += `|${link}|${desc}|\n`;
				break;
			}
		}
	}
}

tR += table;
%>