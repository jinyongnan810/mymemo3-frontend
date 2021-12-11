import React, { Fragment, useEffect, useRef, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import { updateMemo } from "../../actions/memo";
import CodeBlock from "./CodeBlock";
import { showMessages } from "../../actions/messages";
import FileUploader from "./FileUploader";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import ImageModal from "./ImageModal";
import FloatingButton from "./FloatingButton";
let loadingCount = 0;
let timer: NodeJS.Timer;
const loadingMsg = [
  "Server warming up...",
  "Please Wait a few seconds...",
  "It usually takes about 40s...",
  "Finishing warming up...",
  "Hmm...This is interesting...",
  "I'm sorry.There is somthing wrong...",
];
const Content = () => {
  const [editing, toggleEditing] = useState(false);
  const [text, setText] = useState('')
  const [scaledImage, setScaledImage] = useState<string | null>(null);
  const contentEl = useRef<HTMLTextAreaElement>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentMemo, loading } = useAppSelector((state) => state.memo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentMemo) {
      if (editing) {
        toggleEditing(false);
      }
      // contentEl.current!.value = currentMemo.content;
      setText(currentMemo.content);
    }
    // eslint-disable-next-line
  }, [currentMemo]);

  useEffect(() => {
    if (loading) {
      timer = setInterval(() => {
        if (loadingCount >= loadingMsg.length) {
          dispatch(showMessages(`${loadingMsg[loadingMsg.length - 1]}`));
        } else {
          dispatch(showMessages(`${loadingMsg[loadingCount]}`));
          loadingCount++;
        }
      }, 10000);
    } else {
      clearInterval(timer);
      if (loadingCount > 0) {
        dispatch(showMessages(`Thank you for your patience!`));
      }
    }
    // eslint-disable-next-line
  }, [loading]);

  // events
  const onImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clicked = e.target as HTMLElement;
    if (clicked.tagName === 'IMG') {
      e.stopPropagation()
      const img = clicked as HTMLImageElement;
      setScaledImage(img.src)
    }
  }
  const onScaledImageClose = () => {
    setScaledImage(null);
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    var keyCode = e.keyCode || e.which;
    // allow tab
    if (keyCode === 9) {
      e.preventDefault();
      insertToCursor("\t");
    }
    // save
    if (e.ctrlKey || e.metaKey) {
      if (keyCode === 83) {
        e.preventDefault();
        toggleEdit();
      }
    }
    // color
    if (e.ctrlKey) {
      if (keyCode === 89) {
        e.preventDefault();
        insertColor();
      }
    }
    // link
    if (e.ctrlKey) {
      if (keyCode === 76) {
        e.preventDefault();
        insertLink();
      }
    }
  };
  const onDragOver = () => {
    const uploadEl = document.getElementById("upload");
    if (uploadEl) {
      uploadEl.classList.add("show");
    }
  };
  const onDropExit = () => {
    const uploadEl = document.getElementById("upload");
    if (uploadEl) {
      uploadEl.classList.remove("show");
    }
  };
  const toggleEdit = () => {
    if (!isAuthenticated) {
      return;
    }
    if (editing) {
      dispatch(
        updateMemo({ content: text }, currentMemo!.id)
      );
    }
    toggleEditing(!editing);
  };
  // key event functions
  const insertColor = () => {
    const text1 = "<span style='color:skyblue'>";
    const text2 = "</span>";
    const cursorStart = 19;
    const cursorEnd = 26;
    insertToCursorSide(text1, text2, cursorStart, cursorEnd);
  };
  const insertLink = () => {
    const text1 = "[";
    const text2 = "]()";
    const cursorStart = null;
    const cursorEnd = null;
    insertToCursorSide(text1, text2, cursorStart, cursorEnd);
  };
  const insertToCursor = (text: string) => {
    const textarea: any = document.getElementById("k-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const contentAfter =
      text.substring(0, start) +
      text +
      text.substring(end);
    setText(contentAfter);
    setTimeout(() => {
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
    }, 100);
  };
  const insertToCursorSide = (
    text1: string,
    text2: string,
    cursorStart: number | null,
    cursorEnd: number | null
  ) => {
    const textarea: any = document.getElementById("k-editor");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const length = end - start;

    const contentAfter =
      text.substring(0, start) +
      text1 +
      text.substring(start, end) +
      text2 +
      text.substring(end);
    setText(contentAfter);
    setTimeout(() => {
      if (cursorStart) {
        textarea.selectionStart = start + cursorStart;
        textarea.selectionEnd = start + cursorEnd;
      } else {
        textarea.selectionStart = start + 1 + length + 2;
        textarea.selectionEnd = textarea.selectionStart;
      }
    }, 100);
  };
  const onUploadFile = (name: string, link: string) => {
    const fileName = name.split(".")[0];
    const insertStr = `![${fileName}](${link})`;
    insertToCursorSide(insertStr, "", 2, 2 + fileName.length);

    const uploadEl = document.getElementById("upload");
    if (uploadEl) {
      uploadEl.classList.remove("show");
    }
  };
  const onPasteFile = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items[0];
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (!file) return;
      const fileName = file.name;
      if (file.size >= 1024000) {
        dispatch(showMessages("File need to be smaller than 1Mb.", "danger"));
        return;
      }
      var reader = new FileReader();
      reader.onloadend = async () => {
        const cfg = {
          headers: { "Content-Type": "application/json" },
        };
        try {
          dispatch(showMessages("Uploading..."));
          const res = await axios.post(
            "/api/upload",
            JSON.stringify({ data: reader.result }),
            cfg
          );
          if (res.status !== 200) {
            showMessages("Upload failed.", "danger");
            if (res.status === 503) {
              showMessages("File too large.", "danger");
            }
          } else {
            dispatch(showMessages("Uploaded."));
            onUploadFile(fileName, res.data["secure_url"]);
          }
        } catch (error) {
          console.log("Upload failed.", error);
          dispatch(showMessages("Upload failed.", "danger"));
          return;
        }
      };
      reader.readAsDataURL(file);
    } else {
      return;
    }
  };

  if (loading) {
    return (
      <Fragment>
        <img
          src="assets/imgs/loading-white.svg"
          alt="Loading..."
          className="k-loading"
        />
      </Fragment>
    );
  } else if (currentMemo) {
    return (
      <div
        id="content"
        className="k-editor-container"
        onDragOver={(e) => onDragOver()}
        onDragExit={(e) => onDropExit()}
        onDragEnd={(e) => onDropExit()}
        onDrop={(e) => onDropExit()}
      >
        {isAuthenticated && <FloatingButton editing={editing} toggleEdit={toggleEdit} />}
        {editing ? <FileUploader onUploadFile={onUploadFile} /> : ""}
        <CSSTransition in={editing} timeout={300} unmountOnExit classNames='k-editor-transition'>

          <div className='k-content hide-scrollbar'>
            <textarea
              className="k-editor hide-scrollbar"
              id="k-editor"
              onKeyDown={(e) => onKeyDown(e)}
              onPaste={(e) => onPasteFile(e)}
              ref={contentEl}
              value={text}
              onChange={e => setText(e.target.value)}
            ></textarea>
          </div>
        </CSSTransition>
        <div
          id="content-display"
          onClick={onImageClick}
          className='k-content hide-scrollbar'
        >
          <ReactMarkdown
            children={text}
            linkTarget="_blank"
          />
        </div>
        <ImageModal img={scaledImage} onClose={onScaledImageClose} />
      </div>
    );
  } else {
    return (
      <div className="k-content">
        <h1>No memos found...</h1>
      </div>
    );
  }
};

export default Content;
