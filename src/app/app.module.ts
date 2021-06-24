import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileExplorer, FileExplorerTree, FileExplorerTreeItem } from './sidebar';
import {
  EditorLineNumbersComponent,
  EditorTabListComponent,
  EditorTabListItemComponent,
  EditorTabsComponent,
  EditorWindowComponent,
  EditorWindowScreenComponent,
  WelcomeWindowComponent,
  WelcomeWindowScreenComponent,
} from './main-screen';
import { StatusBarComponent, StatusBarRowComponent } from './status-bar';
import { SafeHtmlPipe } from './main-screen/editor-window/component/safe-html.pipe';
import { EditorTabService, StatusBarService, UserFileService } from './services';
import { CommandPaletteComponent, ContextMenuComponent } from './common';

@NgModule({
  declarations: [
    AppComponent,
    EditorWindowComponent,
    EditorWindowScreenComponent,
    EditorTabsComponent,
    EditorTabListComponent,
    EditorTabListItemComponent,
    EditorLineNumbersComponent,
    WelcomeWindowComponent,
    WelcomeWindowScreenComponent,
    FileExplorer,
    FileExplorerTree,
    FileExplorerTreeItem,
    StatusBarComponent,
    StatusBarRowComponent,
    SafeHtmlPipe,
    ContextMenuComponent,
    CommandPaletteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    UserFileService,
    EditorTabService,
    StatusBarService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
