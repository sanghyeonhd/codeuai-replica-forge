
import { atom, map } from 'nanostores';
import type { EditorDocument, ScrollPosition } from '~/components/editor/codemirror/CodeMirrorEditor';
import type { ThemeInfo } from '~/utils/theme';
import type { WebContainer } from '@webcontainer/api';
import { webcontainer } from '~/lib/webcontainer';
import type { PreviewInfo } from './previews';
import { usePreviewStore } from './previews';
import type { FileMap as FilesFileMap } from './files';
import type { ActionState } from '~/lib/runtime/action-runner';

export interface ArtifactState {
  mountedFiles: Set<string>;
  selectedFile: string | undefined;
  selectedTab: string | undefined;
  id: string;
  runner: {
    actions: any;
    addAction: (action: any) => void;
    runAction: (action: any) => Promise<void>;
    buildOutput?: any;
    handleDeployAction: (step: string, status: string, data: any) => void;
  };
  [key: string]: any;
}

export interface WorkbenchViewState {
  showWorkbench: boolean;
}

export type PanelView = 'code' | 'preview' | 'terminal' | 'diff';
export type WorkbenchViewType = 'code' | 'diff' | 'preview';

export interface PanelViewState {
  currentView: PanelView;
  showTerminal: boolean;
}

export interface WorkbenchState {
  artifacts: Record<string, ArtifactState>;
  showWorkbench: boolean;
  currentView: PanelView;
  showTerminal: boolean;
  theme: ThemeInfo;
  isRunningCommand: boolean;
  selectedFile?: string;
  currentDocument?: EditorDocument;
  unsavedFiles: Set<string>;
  modifiedFiles: Set<string>;
  isStreaming: boolean;
  chatStarted: boolean;
  showTerminalButton: boolean;
}

export type FileMap = Record<string, string>;
export type ActionAlert = {
  id?: string;
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  description: string;
  content: string;
  source?: string;
};

class WorkbenchStore {
  #actionAlert = atom<ActionAlert | undefined>(undefined);
  #artifact = atom<ArtifactState>({
    mountedFiles: new Set(),
    selectedFile: undefined,
    selectedTab: undefined,
    id: 'default',
    runner: {
      actions: {},
      addAction: () => {},
      runAction: async () => {},
      handleDeployAction: () => {},
    },
  });

  #files = map<FileMap>({});
  #unsavedFiles = atom<Set<string>>(new Set());
  #modifiedFiles = atom<Set<string>>(new Set());

  #selectedFile = atom<string | undefined>();
  #currentDocument = atom<EditorDocument | undefined>();

  #showWorkbench = atom<boolean>(false);
  #currentView = atom<PanelView>('code');
  #showTerminal = atom<boolean>(false);
  #theme = atom<ThemeInfo>({ name: 'Default', label: 'Default' });
  #isRunningCommand = atom<boolean>(false);
  #isStreaming = atom<boolean>(false);
  #chatStarted = atom<boolean>(false);
  #showTerminalButton = atom<boolean>(false);

  #previews = atom<PreviewInfo[]>([]);
  #scrollPosition = atom<ScrollPosition>({ scrollTop: 0 });

  // Initialize preview store with webcontainer
  #previewStore = usePreviewStore(webcontainer);

  constructor() {
    if (this.#previewStore) {
      // Subscribe to preview updates
      this.#previewStore.previews.subscribe((previews) => {
        this.#previews.set(previews);
      });
    }
  }

  get actionAlert() {
    return this.#actionAlert;
  }

  get artifact() {
    return this.#artifact;
  }

  get artifacts() {
    return map({ default: this.#artifact.get() });
  }

  get files() {
    return this.#files;
  }

  get unsavedFiles() {
    return this.#unsavedFiles;
  }

  get modifiedFiles() {
    return this.#modifiedFiles;
  }

  get selectedFile() {
    return this.#selectedFile;
  }

  get currentDocument() {
    return this.#currentDocument;
  }

  get showWorkbench() {
    return this.#showWorkbench;
  }

  get currentView() {
    return this.#currentView;
  }

  get showTerminal() {
    return this.#showTerminal;
  }

  get theme() {
    return this.#theme;
  }

  get isRunningCommand() {
    return this.#isRunningCommand;
  }

  get isStreaming() {
    return this.#isStreaming;
  }

  get chatStarted() {
    return this.#chatStarted;
  }

  get showTerminalButton() {
    return this.#showTerminalButton;
  }

  get previews() {
    return this.#previews;
  }

  get scrollPosition() {
    return this.#scrollPosition;
  }

  // Compatibility getters for existing code
  get alert() {
    return this.#actionAlert;
  }

  get deployAlert() {
    return this.#actionAlert;
  }

  get supabaseAlert() {
    return this.#actionAlert;
  }

  get firstArtifact() {
    return this.#artifact.get();
  }

  setSelectedFile(filePath: string | undefined) {
    this.#selectedFile.set(filePath);
  }

  setCurrentDocumnet(document: EditorDocument | undefined) {
    this.#currentDocument.set(document);
  }

  setCurrentDocumentContent(content: string) {
    const current = this.#currentDocument.get();
    if (current) {
      this.#currentDocument.set({
        ...current,
        value: content,
      });
    }
  }

  setCurrentDocumentScrollPosition(position: ScrollPosition) {
    this.#scrollPosition.set(position);
  }

  setDocuments(files: FileMap | FilesFileMap) {
    // Convert FilesFileMap to simple FileMap if needed
    const simpleFiles: FileMap = {};
    Object.entries(files).forEach(([path, dirent]) => {
      if (typeof dirent === 'string') {
        simpleFiles[path] = dirent;
      } else if (dirent && typeof dirent === 'object' && 'content' in dirent) {
        simpleFiles[path] = dirent.content;
      }
    });
    this.#files.set(simpleFiles);
  }

  setShowWorkbench(show: boolean) {
    this.#showWorkbench.set(show);
  }

  setCurrentView(view: PanelView) {
    this.#currentView.set(view);
  }

  setShowTerminal(show: boolean) {
    this.#showTerminal.set(show);
  }

  setTheme(theme: ThemeInfo) {
    this.#theme.set(theme);
  }

  setIsRunningCommand(isRunning: boolean) {
    this.#isRunningCommand.set(isRunning);
  }

  setIsStreaming(isStreaming: boolean) {
    this.#isStreaming.set(isStreaming);
  }

  setChatStarted(started: boolean) {
    this.#chatStarted.set(started);
  }

  setShowTerminalButton(show: boolean) {
    this.#showTerminalButton.set(show);
  }

  setReloadedMessages(messageIds?: string[]) {
    // Compatibility method
  }

  toggleTerminal(value?: boolean) {
    const newValue = value !== undefined ? value : !this.#showTerminal.get();
    this.#showTerminal.set(newValue);

    if (newValue) {
      this.#currentView.set('terminal');
    }
  }

  addFile(filePath: string, content: string) {
    const files = this.#files.get();
    this.#files.setKey(filePath, content);

    if (this.#previewStore) {
      // Notify preview store of file changes
      this.#previewStore.notifyFileChange();
    }
  }

  addArtifact(artifact?: any) {
    // Compatibility method
  }

  updateFile(filePath: string, content: string) {
    const files = this.#files.get();
    const previousContent = files[filePath];

    if (previousContent !== content) {
      this.#files.setKey(filePath, content);

      // Mark file as modified
      const modifiedFiles = new Set(this.#modifiedFiles.get());
      modifiedFiles.add(filePath);
      this.#modifiedFiles.set(modifiedFiles);

      if (this.#previewStore) {
        // Notify preview store of file changes
        this.#previewStore.notifyFileChange();
      }
    }
  }

  saveFile(filePath: string) {
    const unsavedFiles = new Set(this.#unsavedFiles.get());
    unsavedFiles.delete(filePath);
    this.#unsavedFiles.set(unsavedFiles);

    if (this.#previewStore) {
      // Notify preview store when files are saved
      this.#previewStore.notifyFileChange();
    }
  }

  saveCurrentDocument() {
    return Promise.resolve();
  }

  saveAllFiles() {
    this.#unsavedFiles.set(new Set());

    if (this.#previewStore) {
      // Notify preview store when files are saved
      this.#previewStore.notifyFileChange();
    }
  }

  deleteFile(filePath: string) {
    this.#files.setKey(filePath, undefined);

    const unsavedFiles = new Set(this.#unsavedFiles.get());
    unsavedFiles.delete(filePath);
    this.#unsavedFiles.set(unsavedFiles);

    const modifiedFiles = new Set(this.#modifiedFiles.get());
    modifiedFiles.delete(filePath);
    this.#modifiedFiles.set(modifiedFiles);

    if (this.#previewStore) {
      // Notify preview store of file changes
      this.#previewStore.notifyFileChange();
    }
  }

  deleteFolder(folderPath: string) {
    // Compatibility method
  }

  createFile(filePath: string, content: string = '') {
    this.addFile(filePath, content);
  }

  createFolder(folderPath: string) {
    // Compatibility method
  }

  resetCurrentDocument() {
    // Compatibility method
  }

  resetAllFileStates() {
    this.#unsavedFiles.set(new Set());
    this.#modifiedFiles.set(new Set());
  }

  resetAllFileModifications() {
    this.resetAllFileStates();
  }

  getModifiedFiles() {
    return this.#files.get();
  }

  downloadZip() {
    // Compatibility method
  }

  syncFiles(directoryHandle?: any) {
    return Promise.resolve();
  }

  pushToGitHub(repoName?: string, commitMessage?: string, username?: string, token?: string, isPrivate?: boolean) {
    return Promise.resolve('');
  }

  // File locking methods for compatibility
  lockFile(filePath: string) {
    // Compatibility method
  }

  unlockFile(filePath: string) {
    // Compatibility method
  }

  lockFolder(folderPath: string) {
    // Compatibility method
  }

  unlockFolder(folderPath: string) {
    // Compatibility method
  }

  isFileLocked(filePath: string) {
    return false;
  }

  isFolderLocked(folderPath: string) {
    return false;
  }

  // Alert management methods
  clearAlert() {
    this.#actionAlert.set(undefined);
  }

  clearSupabaseAlert() {
    this.#actionAlert.set(undefined);
  }

  clearDeployAlert() {
    this.#actionAlert.set(undefined);
  }

  abortAllActions() {
    // Implementation for aborting actions
  }

  // Missing methods that components expect
  updateArtifact(messageId: string, data: any) {
    // Compatibility method
  }

  addAction(data: any) {
    // Compatibility method
  }

  runAction(data: any) {
    return Promise.resolve();
  }

  attachBoltTerminal(terminal: any) {
    // Compatibility method
  }

  attachTerminal(terminal: any) {
    // Compatibility method
  }

  onTerminalResize(callback: any) {
    // Compatibility method
  }
}

export const workbenchStore = new WorkbenchStore();
