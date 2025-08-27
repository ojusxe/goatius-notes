"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
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
        // Use Gemini API directly (or a helper)
        // You may want to refactor this to a shared util
        const prompt = `You are a helpful assistant that answers questions about a user's notes.\nAssume all questions are related to the user's notes.\nMake sure that your answers are not too verbose and you speak succinctly.\nYour responses MUST be formatted in clean, valid HTML with proper structure.\nUse tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate.\nDo NOT wrap the entire response in a single <p> tag unless it's a single paragraph.\nAvoid inline styles, JavaScript, or custom attributes.\nRendered like this in JSX:\n<p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />\nHere are the user's notes:\n${formattedNotes}`;
        let conversation = prompt;
        for (let i = 0; i < newQuestions.length; i++) {
          conversation += `\nUser: ${newQuestions[i]}\n`;
          if (responses.length > i) {
            conversation += `Assistant: ${responses[i]}\n`;
          }
        }
        // Gemini API call (pseudo-code, replace with your actual Gemini call)
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // const result = await model.generateContent(conversation);
        // response = result.response.text();
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
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent
        className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
        ref={contentRef}
      >
        <DialogHeader>
          <DialogTitle>Ask AI About Your Notes</DialogTitle>
          <DialogDescription>
            Out AI can answer questions about all of your notes
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-8">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>

        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              minHeight: "0",
              lineHeight: "normal",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button className="ml-auto size-8 rounded-full">
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AskAIButton;