import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { EditorTab } from "src/app/models/editor-tab.model";
import { UserFile } from "src/app/models/user-file.model";
import { UserFileService } from "../user-file.service";
import { EditorTabManager } from "./editor-tab-manager";

@Injectable()
export class EditorTabService implements OnDestroy {
  private tabManager = new EditorTabManager();
  private subscription!: Subscription;

  private allTabs$ = new BehaviorSubject<EditorTab[]>([]);
  private activeTab$ = new BehaviorSubject<EditorTab | undefined>(undefined);

  constructor(private userFileService: UserFileService) {
    this.trackUserFilesToCreateTabs();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private trackUserFilesToCreateTabs() {
    this.subscription = this.userFileService
      .getAll()
      .pipe(
        map(userFiles => {
          this.tabManager.createTabs(userFiles);
          const allTabs = this.tabManager.getAllTabs();
          this.allTabs$.next(allTabs);
          this.setActiveTab(allTabs[0]);
        })
      ).subscribe();
  }

  public getAllTabs(): Observable<EditorTab[]> {
    return this.allTabs$;
  }

  public getActiveTab(): Observable<EditorTab | undefined> {
    return this.activeTab$;
  }

  // TODO: Think of a better name?
  public openTabFromFile(file: UserFile) {
    this.tabManager.getOrCreateTabFromFile(file);
  }

  public openTab(tabId?: string) {
    if (!tabId) {
      // Closed last tab.
      this.activeTab$.next(undefined);
      return;
    }

    this.getActiveTab()
    .pipe(take(1))
    .subscribe(activeTab => {
      if (activeTab?.id === tabId) {
        // Tab is already active.
        return;
      }

      const newTab = this.tabManager.getTabById(tabId);
      this.setActiveTab(newTab);
    })
    .unsubscribe();
  }

  public closeTab(tabId: string): void {
    const closedTab = this.tabManager.getTabById(tabId);
    this.tabManager.removeTab(tabId);
    this.userFileService.remove(closedTab.userFileId);

    const tabsLeft = this.tabManager.getAllTabs();
    this.allTabs$.next(tabsLeft);

    if (tabsLeft.length < 1) {
      // Closed last tab.
      this.setActiveTab(undefined);
      return;
    }

    this.activeTab$.subscribe(activeTab => {
      if (!activeTab) {
        debugger;
        throw new Error("This shouldn't be null - if a file exists, a tab must be opened!");
      }

      const closingCurrentTab = activeTab.id === tabId;
      if (closingCurrentTab) {
        const randomTab = this.tabManager.getRandomTab();
        this.setActiveTab(randomTab);
        return;
      }
    }).unsubscribe();
  }

  public updateTab(tab: EditorTab): void {
    this.tabManager.updateTab(tab);
  }

  private setActiveTab(tab?: EditorTab): void {
    this.activeTab$.next(tab);
  }
}
