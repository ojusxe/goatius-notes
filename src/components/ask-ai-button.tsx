"use client";

import { User } from "@supabase/supabase-js";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Textarea } from "@/components/custom";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/notes";
import { getGuestNotes } from "@/utils/guestNotes";
import "../app/styles/ai-response.css";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const handleOnOpenChange = (isOpen: boolean) => {
    // Allow guests to use AI
    if (isOpen) {
      setQuestionText("");
      setQuestions([]);
      setResponses([]);
    }
    setOpen(isOpen);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      let response;
      if (user) {
        response = await askAIAboutNotesAction(newQuestions, responses);
      } else {
        // Guest: use notes from localStorage
        const guestNotes = getGuestNotes();
        // Format notes for prompt
        const formattedNotes = guestNotes
          .map((note) => `Text: ${note.text}\nCreated at: ${note.createdAt}\nLast updated: ${note.updatedAt}`)
          .join("\n");
        response = "[Guest AI response would go here]";
      }
      setResponses((prev) => [...prev, response]);
      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={handleOnOpenChange}>
        <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ask AI About Your Notes</DialogTitle>
            <DialogDescription>
              Our AI can answer questions about all of your notes
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-8 flex-1 overflow-y-auto" ref={contentRef}>
            {questions.map((question, index) => (
              <Fragment key={index}>
                <div className="ml-auto max-w-[60%] rounded-lg bg-surface-elevated px-4 py-2">
                  <p className="text-primary text-sm font-body">{question}</p>
                </div>
                {responses[index] && (
                  <div className="max-w-[80%] rounded-lg bg-primary/5 px-4 py-2">
                    <div
                      className="bot-response text-secondary text-sm font-body leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                    />
                  </div>
                )}
              </Fragment>
            ))}
            {isPending && (
              <div className="flex items-center gap-2">
                <div className="animate-pulse text-sm text-tertiary font-body">Thinking...</div>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div
              className="flex cursor-text flex-col rounded-lg border border-border p-4 bg-surface"
              onClick={handleClickInput}
            >
              <Textarea
                ref={textareaRef}
                placeholder="Ask me anything about your notes..."
                className="resize-none border-none bg-transparent p-0 shadow-none focus:ring-0 min-h-[20px]"
                rows={1}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  className="rounded-full w-8 h-8 p-0"
                  onClick={handleSubmit}
                  disabled={!questionText.trim() || isPending}
                >
                  <ArrowUpIcon size={16} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AskAIButton;