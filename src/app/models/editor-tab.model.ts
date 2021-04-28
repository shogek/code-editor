/** I represent a file opened in the editor tab. */
export interface EditorTab {
  id: string;

  userFileId: string;

  /** Text which will be show in the editor's tab. */
  name: string;

  /** Contents of a file which will be editable in the editor. */
  contents: string;

  // TODO: On tab open, set caret to last known position.
  /** Indicates how many characters are between the cursor and the start of file. */
  caretOffset: number;

  /**
   * ID of DOM element which represents the currently selected line in the editor.
   * Can be the line's <p> element or a <span> inside it. 
   */
  activeLineElementId: string;

  // TODO: On click 'Delete'/'Backspace', check if line removed; on click 'Enter', check if line added.
  /** Indicates the number of lines the file has. */
  lineCount: number;
}