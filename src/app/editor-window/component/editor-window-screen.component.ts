import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from "@angular/core";
import { UserFile } from "src/app/models/user-file.model";

@Component({
   selector: 'app-editor-window-screen',
   templateUrl: './editor-window-screen.component.html',
   styleUrls: ['./editor-window-screen.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorWindowScreenComponent {
   @Input() set activeFile(value: UserFile) {
      this.fileContents = value?.contents ?? '';
      this.fileLineCount = value?.contents?.split('\n').length;
   }
   @Input() activeLine = 0;
   @Output() editorClicked = new EventEmitter<HTMLElement>();

   fileLineCount = 0;
   fileContents = '';

   public onEditorClick(e: MouseEvent) {
      this.editorClicked.emit(e.target as HTMLElement);
   }
}
