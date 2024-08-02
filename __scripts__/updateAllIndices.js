const updateAllIndices = async (
  folder /* TFile | null */, 
  workspace /* this.app.workspace */, 
  vault /* this.app.vault */,
  tp /* templator plugin */,
  metadataCache /* MetadataCache */
) => {
  let tags = new Map(); 
  await updateAllIndicesHelper(folder, workspace, vault, tp, metadataCache, tags);

  // here we will update all the tag pages
  for (const tag of tags) {
    const tagName = tag[0];
    if (!tagName || tagName.length === 0) {
      continue;
    }
    const fileInfo = tag[1]; // Set<[fileLink, description]>>
    const tagPagePath = `tags/${tagName}.md`;

    let tagPage = vault.getAbstractFileByPath(tagPagePath);
    if (tagPage === null) {
      tagPage = await vault.create(tagPagePath, '');
    }
    await workspace.activeLeaf.openFile(tagPage);
    const existingContent = await vault.read(tagPage);
    const mdMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);
    const existingMetadata = mdMatch ? `${mdMatch[0]}\n` : "";
    
    let updatedGenText = `## Notes containing the tag(s) ${tagName}\n`;
    updatedGenText += `|file link|description|\n|---|---|\n`;
    for (const info of fileInfo) {
      updatedGenText += `|${info[0]}|${info[1]}|\n`;
    }
    await vault.modify(tagPage, existingMetadata + updatedGenText);
  }
};

const updateAllIndicesHelper = async (
  folder /* TFile | null */, 
  workspace /* this.app.workspace */, 
  vault /* this.app.vault */,
  tp /* templator plugin */,
  metadataCache /* MetadataCache */,
  tags /* HashMap<tagNames, Set<[fileLink, description]>> */
) => {
  // here we are going to assume a starting point of "full_notes"
  let curIndex;
  if (folder && folder.children) {
    for (const file of folder.children) {
      if (file.name === 'index.md') {
        // save it and do it last
        curIndex = file;
        continue;
      }

      if (file.extension !== 'md' && file.children && file.children.length > 0) {
        // this is likely a folder. We shall traverse to the bottom and work our way up 
        await updateAllIndicesHelper(file, workspace, vault, tp, metadataCache, tags);
        continue;
      }

      // this might be a primary file, we need to find out 
      // if it is, we need to update the tag map with the tags mentioned in it 
      const md = metadataCache.getFileCache(file);
      if (file.extension === 'md' && md && md.frontmatter && md.frontmatter.is_primary) {
        if (!md.tags) {
          continue;
        }
        for (const tag of md.tags) {
          const link = `[[${file.path}\\|${file.basename}]]`;
          const desc = md.frontmatter.description ?? "No description provided";
          const tagName = tag.tag.slice(1);
          let correspondingFileLinkSet;
          if (tags.has(tagName)) {
              correspondingFileLinkSet = tags.get(tagName);
          } else {
              tags.set(tagName, new Set());
              correspondingFileLinkSet = tags.get(tagName);
          }
          correspondingFileLinkSet.add([link, desc]);
        }
      }
    }
  }

  // finally we update ourselves after having taken care of the children
  if (curIndex) {
    await tp.user.runTemplateAtFile(curIndex, workspace, vault, tp, "[[__template__index]]");
  }
}

module.exports = updateAllIndices;
