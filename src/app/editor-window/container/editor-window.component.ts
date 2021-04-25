import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { EditorTab } from "src/app/models/editor-tab.model";
import { EditorService } from "src/app/services/editor/editor.service";
import {
   getClickedLine,
   getCaretOffset,
   getActiveLineAfterArrowUp,
   getActiveLineAfterArrowDown,
   getActiveLineAfterArrowLeft,
   getActiveLineAfterArrowRight
} from "./editor-window-component.logic";

@Component({
   selector: 'app-editor',
   templateUrl: './editor-window.component.html',
   styleUrls: ['./editor-window.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorWindowComponent implements OnInit, OnDestroy {
   private subscriptions: Subscription[] = [];
   private activeLine = 1;
   private lineCount = 1;

   allTabs$: Observable<EditorTab[]> = this.editorService.getAllTabs();
   activeTab$: Observable<EditorTab | undefined> = this.editorService.getActiveTab();
   activeLine$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

   constructor(public editorService: EditorService) { }

   ngOnInit() {
      this.subscriptions.push(
         this.editorService.getActiveTab().subscribe(activeTab => {
            this.setActiveLine(activeTab?.activeLine ?? 1);
            this.lineCount = activeTab?.lineCount ?? 1;
         })
      );
   }

   ngOnDestroy() {
      this.subscriptions.forEach(x => x.unsubscribe());
   }

   public handleMouseDown(e: MouseEvent) {
      // Using 'setTimeout' will allow the offset to be calculated from the current 'mousedown' instead of the last 'click' event.
      setTimeout(() => {
         const clickedLine = getClickedLine(e.target as HTMLElement);
         this.setActiveLine(clickedLine);
      });
   }

   public handleKeyDown(e: KeyboardEvent) {
      // Using 'setTimeout' will allow the offset to be calculated from the current 'mousedown' instead of the last 'click' event.
      setTimeout(() => {
         const caretOffset = getCaretOffset();
         
         let newActiveLine: number | undefined;
         const { activeLine, lineCount } = this;

         switch (e.key) {
            case 'ArrowUp':
               newActiveLine = getActiveLineAfterArrowUp(activeLine);
               break;
            case 'ArrowDown':
               newActiveLine = getActiveLineAfterArrowDown(activeLine, lineCount);
               break;
            case 'ArrowLeft':
               newActiveLine = getActiveLineAfterArrowLeft(e, caretOffset, activeLine);
               break;
            case 'ArrowRight':
               newActiveLine = getActiveLineAfterArrowRight(e, caretOffset, lineCount, activeLine);
               break;
            default: break;
         }

         if (newActiveLine) {
            this.setActiveLine(newActiveLine);
         }
      });
   }

   private setActiveLine(line: number) {
      this.activeLine = line;
      this.activeLine$.next(line);
   }
}
