'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { ENV_LOCALE } from '@/constants/env';
import { editorLocales } from '@/i18n/editor';
import { uploadImage } from '@/lib/utils';

interface BlockNoteEditorProps {
  isDark: boolean;
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export default function BlockNoteEditor({ isDark, initialContent, onContentChange }: BlockNoteEditorProps) {
  // 解析初始内容
  const getInitialContent = () => {
    if (initialContent) {
      try {
        return JSON.parse(initialContent);
      } catch {
        // 如果解析失败，返回默认内容
        return [
          {
            type: 'paragraph',
            content: initialContent,
          },
        ];
      }
    }
    return [
      {
        type: 'paragraph',
        content: '开始编写你的文章...',
      },
    ];
  };

  const editor = useCreateBlockNote({
    initialContent: getInitialContent(),
    dictionary: editorLocales[ENV_LOCALE as keyof typeof editorLocales],
    uploadFile: async (file: File) => {
      try {
        const imageData = await uploadImage(file);
        if (!imageData) {
          throw new Error('图片上传失败：返回数据为空');
        }
        return imageData.url;
      } catch (error) {
        console.error('图片上传失败:', error);
        throw error;
      }
    },
  });

  return (
    <div className="w-full min-h-[400px]">
      <BlockNoteView
        editor={editor}
        theme={isDark ? 'dark' : 'light'}
        onChange={async () => {
          if (onContentChange) {
            // 将编辑器内容转换为HTML
            try {
              const htmlContent = await editor.blocksToHTMLLossy();
              onContentChange(htmlContent);
            } catch (error) {
              console.error('转换HTML失败:', error);
              // 如果转换失败，回退到JSON格式
              const content = JSON.stringify(editor.document);
              onContentChange(content);
            }
          }
        }}
      />
    </div>
  );
}