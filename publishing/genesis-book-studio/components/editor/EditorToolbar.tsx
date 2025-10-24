'use client'

import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  const ToolbarButton = ({
    onClick,
    active = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition ${
        active
          ? 'bg-fire/10 text-fire'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Cmd+B)"
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Cmd+I)"
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={18} />
        </ToolbarButton>
      </div>

      {/* Insert */}
      <div className="flex items-center gap-1 px-2 border-r border-gray-300">
        <ToolbarButton onClick={addLink} title="Insert Link">
          <LinkIcon size={18} />
        </ToolbarButton>

        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon size={18} />
        </ToolbarButton>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 px-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Cmd+Z)"
        >
          <Undo size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>
    </div>
  )
}
