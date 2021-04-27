import React, { Fragment, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown/with-html";
import { updateMemo } from "../../actions/memo";
import CodeBlock from "./CodeBlock";
import Moment from "react-moment";
import moment from "moment";
import { showMessages } from "../../actions/messages";
import FileUploader from "./FileUploader";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
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
  const [content, editContent] = useState("");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentMemo, loading } = useAppSelector((state) => state.memo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentMemo) {
      if (editing) {
        toggleEditing(false);
      }
      editContent(currentMemo.content);
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
      dispatch(updateMemo({ content }, currentMemo!.id));
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
      content.substring(0, start) + text + content.substring(end);
    editContent(contentAfter);
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
      content.substring(0, start) +
      text1 +
      content.substring(start, end) +
      text2 +
      content.substring(end);
    editContent(contentAfter);
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
        className="k-editor-container fadeout-both"
        onDoubleClick={(e) => toggleEdit()}
        onDragOver={(e) => onDragOver()}
        onDragExit={(e) => onDropExit()}
        onDragEnd={(e) => onDropExit()}
        onDrop={(e) => onDropExit()}
      >
        {editing ? <FileUploader onUploadFile={onUploadFile} /> : ""}
        <div className={editing ? "k-content" : "k-content hide"}>
          <textarea
            className="k-editor hide-scrollbar"
            id="k-editor"
            onChange={(e) => editContent(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
            value={content}
          ></textarea>
        </div>
        <div
          id="content-display"
          className={editing ? "k-content hide" : "k-content"}
        >
          <div className="k-updated-time">
            <Moment format="GG.M.D kk:mm">
              {moment.utc(currentMemo.updatedAt).local()}
            </Moment>
          </div>
          <ReactMarkdown
            source={currentMemo.content}
            escapeHtml={false}
            linkTarget="_blank"
            renderers={{ code: CodeBlock }}
          />
        </div>
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
