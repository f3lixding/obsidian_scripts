module.exports = async (
  file /* TFile | null */,
  workspace /* this.app.workspace */, 
  vault /* this.app.vault */,
  tp /* templator plugin */,
  templateName /* string */
) => {
  if (file && file.extension === 'md' && !file.children) {
    // we will only process single file in this function 
    await workspace.activeLeaf.openFile(file);
    const existingContent = await vault.read(file);
    const mdMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);
    const existingMetadata = mdMatch ? `${mdMatch[0]}\n` : "";
    const updatedGenText = await tp.file.include(templateName);
    await vault.modify(file, existingMetadata + updatedGenText);
  }
};
