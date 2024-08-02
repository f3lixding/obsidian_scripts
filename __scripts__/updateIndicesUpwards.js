const updateIndicesUpwards = async (
  folder /* TFile | null */, 
  workspace /* this.app.workspace */, 
  vault /* this.app.vault */,
  tp /* templator plugin */
) => {
  if (folder && folder.children) {
		for (const file of folder.children) {
			if (file.name === 'index.md') {
				await workspace.activeLeaf.openFile(file);
				const existingContent = await vault.read(file);
				const mdMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);
				const existingMetadata = mdMatch ? `${mdMatch[0]}\n` : "";
				const updatedGenText = await tp.file.include("[[__template__index]]");
				await vault.modify(file, existingMetadata + updatedGenText);
				break; 
			}
		}
	}

	// and we keep traversing upwards: 
	if (folder.parent) {
		await updateIndicesUpwards(folder.parent, workspace, vault, tp);
	}
};

module.exports = updateIndicesUpwards;
