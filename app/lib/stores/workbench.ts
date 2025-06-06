
import { atom, map } from 'nanostores';
import type { EditorDocument, ScrollPosition } from '~/components/editor/codemirror/CodeMirrorEditor';
import type { ThemeInfo } from '~/utils/theme';
import type { WebContainer } from '@webcontainer/api';
import { webcontainer } from '~/lib/webcontainer';
import type { PreviewInfo } from './previews';
import { usePreviewStore } from './previews';
import type { ActionState } from '~/lib/runtime/action-runner';

// Use compatible types that match the existing system
export interface File {
  type: 'file';
  content: string;
  isBinary?: boolean;
  isLocked?: boolean;
}

export interface Directory {
  type: 'directory';
  isLocked?: boolean;
}

export type Dirent = File | Directory;
export type FileMap = Record<string, Dirent | undefined>;

export interface ArtifactState {
  mountedFiles: Set<string>;
  selectedFile: string | undefined;
  selectedTab: string | undefined;
  id: string;
  runner: {
    actions: map<Record<string, ActionState>>;
    addAction: (action: ActionState) => void;
    runAction: (action: ActionState) => Promise<void>;
    buildOutput?: any;
    handleDeployAction: (step: string, status: string, data: any) => void;
  };
  [key: string]: any;
}

export interface WorkbenchViewState {
  showWorkbench: boolean;
}

export type PanelView = 'code' | 'preview' | 'terminal' | 'diff';
export type WorkbenchViewType = 'code' | 'diff' | 'preview' | 'terminal';

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

export type ActionAlert = {
  id?: string;
  type: 'error' | 'success' | 'info';
  title: string;
  description: string;
  content: string;
  source?: 'preview' | 'terminal';
};

export type SupabaseAlert = {
  id?: string;
  type: 'error' | 'success' | 'info';
  title: string;
  description: string;
  content: string;
  source?: 'supabase';
};

export type DeployAlert = {
  id?: string;
  type: 'error' | 'success' | 'info';
  title: string;
  description: string;
  content: string;
  source?: 'vercel' | 'netlify' | 'github';
};

class WorkbenchStore {
  #actionAlert = atom<ActionAlert | undefined>(undefined);
  #supabaseAlert = atom<SupabaseAlert | undefined>(undefined);
  #deployAlert = atom<DeployAlert | undefined>(undefined);
  #artifact = atom<ArtifactState>({
    mountedFiles: new Set(),
    selectedFile: undefined,
    selectedTab: undefined,
    id: 'default',
    runner: {
      actions: map<Record<string, ActionState>>({}),
      addAction: () => {},
      runAction: async () => {},
      handleDeployAction: () => {},
    },
  });

  #artifacts = map<Record<string, ArtifactState>>({});
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
  #scrollPosition = atom<ScrollPosition>({ line: 0, column: 0 });

  // Initialize preview store with webcontainer
  #previewStore = usePreviewStore(webcontainer);

  constructor() {
    if (this.#previewStore) {
      // Subscribe to preview updates
      this.#previewStore.previews.subscribe((previews) => {
        this.#previews.set([...previews]);
      });
    }

    // Initialize default artifact
    this.#artifacts.setKey('default', this.#artifact.get());
  }

  get actionAlert() {
    return this.#actionAlert;
  }

  get artifact() {
    return this.#artifact;
  }

  get artifacts() {
    return this.#artifacts;
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
    return this.#deployAlert;
  }

  get supabaseAlert() {
    return this.#supabaseAlert;
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

  setDocuments(files: FileMap | any) {
    // Convert any file format to compatible FileMap
    const compatibleFiles: FileMap = {};
    Object.entries(files).forEach(([path, dirent]) => {
      if (typeof dirent === 'string') {
        // Convert string content to File structure
        compatibleFiles[path] = {
          type: 'file',
          content: dirent,
        };
      } else if (dirent && typeof dirent === 'object') {
        // Already in correct format or needs conversion
        if ('content' in dirent) {
          compatibleFiles[path] = {
            type: 'file',
            content: (dirent as any).content,
            isBinary: (dirent as any).isBinary || false,
            isLocked: (dirent as any).isLocked || false,
          };
        } else {
          compatibleFiles[path] = dirent as Dirent;
        }
      }
    });
    this.#files.set(compatibleFiles);
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
    this.#files.setKey(filePath, {
      type: 'file',
      content,
      isBinary: false,
    });

    if (this.#previewStore) {
      // Notify preview store of file changes
      this.#previewStore.notifyFileChange();
    }
  }

  addArtifact(artifact: { id: string; messageId: string; title: string; type: string }) {
    const newArtifact: ArtifactState = {
      mountedFiles: new Set(),
      selectedFile: undefined,
      selectedTab: undefined,
      id: artifact.id,
      runner: {
        actions: map<Record<string, ActionState>>({}),
        addAction: () => {},
        runAction: async () => {},
        handleDeployAction: () => {},
      },
    };
    this.#artifacts.setKey(artifact.id, newArtifact);
  }

  updateFile(filePath: string, content: string) {
    const files = this.#files.get();
    const previousFile = files[filePath];
    const previousContent = previousFile && 'content' in previousFile ? previousFile.content : undefined;

    if (previousContent !== content) {
      this.#files.setKey(filePath, {
        type: 'file',
        content,
        isBinary: false,
      });

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
    // Convert FileMap to the expected format for filesToArtifacts
    const files = this.#files.get();
    const result: Record<string, { content: string }> = {};
    
    Object.entries(files).forEach(([path, dirent]) => {
      if (dirent && dirent.type === 'file') {
        result[path] = { content: dirent.content };
      }
    });
    
    return result;
  }

  downloadZip() {
    // Compatibility method
  }

  syncFiles(directoryHandle?: any) {
    return Promise.resolve();
  }

  pushToGitHub(repoName: string, commitMessage?: string, username?: string, token?: string, isPrivate?: boolean) {
    return Promise.resolve('');
  }

  // File locking methods for compatibility
  lockFile(filePath: string) {
    const files = this.#files.get();
    const file = files[filePath];
    if (file && file.type === 'file') {
      this.#files.setKey(filePath, { ...file, isLocked: true });
    }
  }

  unlockFile(filePath: string) {
    const files = this.#files.get();
    const file = files[filePath];
    if (file && file.type === 'file') {
      this.#files.setKey(filePath, { ...file, isLocked: false });
    }
  }

  lockFolder(folderPath: string) {
    const files = this.#files.get();
    const folder = files[folderPath];
    if (folder && folder.type === 'directory') {
      this.#files.setKey(folderPath, { ...folder, isLocked: true });
    }
  }

  unlockFolder(folderPath: string) {
    const files = this.#files.get();
    const folder = files[folderPath];
    if (folder && folder.type === 'directory') {
      this.#files.setKey(folderPath, { ...folder, isLocked: false });
    }
  }

  isFileLocked(filePath: string) {
    const files = this.#files.get();
    const file = files[filePath];
    return !!(file && file.type === 'file' && file.isLocked);
  }

  isFolderLocked(folderPath: string) {
    const files = this.#files.get();
    const folder = files[folderPath];
    return !!(folder && folder.type === 'directory' && folder.isLocked);
  }

  // Alert management methods
  clearAlert() {
    this.#actionAlert.set(undefined);
  }

  clearSupabaseAlert() {
    this.#supabaseAlert.set(undefined);
  }

  clearDeployAlert() {
    this.#deployAlert.set(undefined);
  }

  abortAllActions() {
    // Implementation for aborting actions
  }

  // Missing methods that components expect
  updateArtifact(messageId: string, data?: any) {
    // Compatibility method
  }

  addAction(action: ActionState) {
    // Add action to the current artifact
    const artifact = this.#artifact.get();
    const actions = artifact.runner.actions.get();
    const actionId = `action_${Date.now()}_${Math.random()}`;
    artifact.runner.actions.setKey(actionId, action);
  }

  runAction(action: ActionState) {
    // Run action on the current artifact
    const artifact = this.#artifact.get();
    return artifact.runner.runAction(action);
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
