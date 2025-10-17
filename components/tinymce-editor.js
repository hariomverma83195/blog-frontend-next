"use client"

import { useEffect, useRef } from "react"

export default function TinyMCEEditor({ value, onChange }) {
  const editorRef = useRef(null)

  useEffect(() => {
    const loadTinyMCE = async () => {
      if (typeof window !== "undefined" && !window.tinymce) {
        const script = document.createElement("script")
        script.src =
          "https://cdn.tiny.cloud/1/az0la97zwc23183mlvhxcg6vxl1wkqbvd04q5dvcodec0z8k/tinymce/6/tinymce.min.js"
        script.referrerPolicy = "origin"
        script.onload = () => {
          initTinyMCE()
        }
        document.head.appendChild(script)
      } else if (window.tinymce) {
        initTinyMCE()
      }
    }

    const initTinyMCE = () => {
      window.tinymce.init({
        selector: "#tinymce-editor",
        plugins:
          "anchor autolink charmap codesample emoticons link lists searchreplace table visualblocks wordcount checklist code",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | code",
        height: 500,
        skin: "oxide",
        content_css: "default",
        content_style: "body { font-family: Inter, ui-sans-serif, system-ui; font-size:16px; line-height:1.6; }",
        setup: (editor) => {
          editor.on("change", () => {
            onChange(editor.getContent())
          })
          editor.on("init", () => {
            editor.setContent(value || "")
          })
        },
      })
    }

    loadTinyMCE()

    return () => {
      if (window.tinymce) {
        window.tinymce.remove("#tinymce-editor")
      }
    }
  }, [value, onChange])

  return <textarea id="tinymce-editor" ref={editorRef} />
}
