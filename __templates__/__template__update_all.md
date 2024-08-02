<%* 
const { vault, workspace, metadataCache } = this.app;
const activeFile = workspace.getActiveFile();
const fullNotesRoot = vault.getAbstractFileByPath('full_notes');


await tp.user.updateAllIndices(fullNotesRoot, workspace, vault, tp, metadataCache);

await workspace.activeLeaf.openFile(activeFile);
%>