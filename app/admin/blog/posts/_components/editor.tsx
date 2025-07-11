'use client';

import dynamic from 'next/dynamic';
import { useIsDark } from '@/hooks/use-is-dark';

const DynamicBlockNoteEditor = dynamic(
  () => import('./block-note-editor'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">加载编辑器中...</div>
      </div>
    ),
  }
);

interface EditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export default function Editor({ initialContent, onContentChange }: EditorProps) {
  const isDark = useIsDark();

  return <DynamicBlockNoteEditor isDark={isDark} initialContent={initialContent} onContentChange={onContentChange} />;
}