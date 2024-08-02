<%*
if (tp.file.content.length === 0) {
let fileName = await tp.system.prompt("Enter the full note name");
await tp.file.rename(fileName);
let description = await tp.system.prompt("Enter a brief description to describe the full note:");
tR += `---
is_primary: true
description: "${description}"
tags:
---

## Premise 
${description}

## Breadcrumbs

`;
}
%>