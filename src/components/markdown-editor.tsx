"use client";

import { useState, useEffect } from "react";
import { updateNoteAction, updateNoteTitleAction } from "@/actions/notes";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Type,
  PenTool,
  Save
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type Props = {
  noteId: string;
  startingNoteText: string;
  startingNoteTitle?: string;
  onTextChange?: (text: string) => void;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

let updateTimeout: NodeJS.Timeout;
let titleUpdateTimeout: NodeJS.Timeout;

function MarkdownEditor({ noteId, startingNoteText, startingNoteTitle = "", onTextChange, onTitleChange, onSave, isSaving }: Props) {
  const [noteText, setNoteText] = useState(startingNoteText);
  const [noteTitle, setNoteTitle] = useState(startingNoteTitle);
  const [isPreview, setIsPreview] = useState(false);

  // Update when props change (e.g., switching notes)
  useEffect(() => {
    setNoteText(startingNoteText);
  }, [startingNoteText]);

  useEffect(() => {
    setNoteTitle(startingNoteTitle);
  }, [startingNoteTitle]);

  const handleUpdateNote = (text: string) => {
    setNoteText(text);
    
    // Notify parent component of text change
    if (onTextChange) {
      onTextChange(text);
    }

    // Debounce the save operation
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      if (noteId && noteId.trim() !== "") {
        updateNoteAction(noteId, text);
      }
    }, 1000);
  };

  const handleUpdateTitle = (title: string) => {
    setNoteTitle(title);
    
    // Notify parent component of title change
    if (onTitleChange) {
      onTitleChange(title);
    }

    // Debounce the save operation
    clearTimeout(titleUpdateTimeout);
    titleUpdateTimeout = setTimeout(() => {
      if (noteId && noteId.trim() !== "") {
        updateNoteTitleAction(noteId, title);
      }
    }, 1000);
  };



  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = noteText.substring(start, end);
    
    const newText = 
      noteText.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      noteText.substring(end);
    
    handleUpdateNote(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      action: () => insertMarkdown("**", "**"),
      title: "Bold"
    },
    {
      icon: Italic,
      action: () => insertMarkdown("*", "*"),
      title: "Italic"
    },
    {
      icon: Underline,
      action: () => insertMarkdown("<u>", "</u>"),
      title: "Underline"
    },
    {
      icon: Link,
      action: () => insertMarkdown("[", "](url)"),
      title: "Link"
    },
    {
      icon: Type,
      action: () => insertMarkdown("# "),
      title: "Heading"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
      {/* Title Input */}
      <div className="mb-4">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => handleUpdateTitle(e.target.value)}
          placeholder="Note title..."
          className="
            w-full px-4 py-3 text-xl font-semibold border border-gray-200 rounded-lg
            bg-white text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
            transition-all duration-200
          "
          style={{
            fontFamily: 'var(--font-inter)',
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="markdown-editor-toolbar flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
              title={button.title}
            >
              <button.icon size={16} />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 px-3 text-sm"
          >
            <PenTool size={14} className="mr-1" />
            Write
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="markdown-editor-content flex-1 relative">
        {!isPreview ? (
          <div className="relative h-full">
            <textarea
              id="markdown-textarea"
              value={noteText}
              onChange={(e) => handleUpdateNote(e.target.value)}
              placeholder="Type your notes here... Use markdown for formatting!"
              className="markdown-editor-textarea w-full h-full resize-none"
            />
            {/* Save Button - Bottom Right of Editor */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              className="absolute bottom-4 right-4 h-8 px-3 text-sm bg-white/90 backdrop-blur-sm shadow-lg border-gray-300"
            >
              <Save size={14} className="mr-1" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <div className="markdown-preview h-full overflow-y-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {noteText || "Start typing to see your formatted notes here..."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarkdownEditor;