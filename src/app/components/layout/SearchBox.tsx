import React from "react";
import { searchMemo } from "../../actions/memo";
import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";

const SearchBox = ({ toggle }: { toggle: Function }) => {
  const [word, setWord] = useState("");
  const [lastSearchedWord, setLastSearchedWord] = useState("");
  const [inputChanged, toggleInputChanged] = useState(false);
  const contentEl = document.getElementById("content");
  const searchEl = document.getElementById("search");
  const dispatch = useAppDispatch();
  //   let searchLock = false;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
    dispatch(searchMemo(e.target.value));
    toggleInputChanged(true);
    // regexSearch(e.target.value);
    // if (!searchLock) {
    //   searchLock = true;
    //   setTimeout(() => {
    //     highlight(word);
    //     searchLock = false;
    //   }, 500);
    // }
  };
  const close = () => {
    dispatch(searchMemo(""));
    clearHighlight();
    toggle(false);
  };
  const regexSearch = (text: string) => {
    if (text) {
      const l = text.length;
      const matches = [
        ...contentEl!.innerText.matchAll(new RegExp(text, "gi")),
      ];
      console.log(matches);
      //   contentEl.selectionStart = matches[0].index;
      //   contentEl.selectionEnd = matches[0].index + l;
    }
  };
  const highlight = (text: string, color = "green") => {
    // remove previous highlight
    if (color != "transparent") {
      highlight(lastSearchedWord, "transparent");
      setLastSearchedWord(text);
    } else {
      toggleInputChanged(false);
    }
    // window.find
    if ((window as any).find && window.getSelection) {
      document.designMode = "on";
      var sel = window.getSelection();
      sel!.collapse(document.body, 0);

      let count = 0;

      while ((window as any).find(text, false, false, false)) {
        document.execCommand("HiliteColor", false, color);
        sel!.collapseToEnd();
        count++;
      }
      document.designMode = "off";
      // focus on the first one
      (window as any).find(word, false, false, true);
      console.log(count);
    }
    // ie
    else if ((document.body as any).createTextRange) {
      var textRange = (document.body as any).createTextRange();
      while (textRange.findText(text)) {
        textRange.execCommand("BackColor", false, color);
        textRange.collapse(false);
      }
    }
    searchEl!.focus();
  };
  const clearHighlight = () => {
    highlight(lastSearchedWord, "transparent");
    setLastSearchedWord("");
  };

  // key events
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    var keyCode = e.keyCode || e.which;
    // close search box
    if (keyCode === 27) {
      e.preventDefault();
      close();
    }
    // enter
    if (keyCode === 13) {
      e.preventDefault();
      if (inputChanged) {
        highlight(word);
      }

      (window as any).find(word, false, false, true);
    }
  };

  return (
    <div className="k-search" onKeyDown={onKeyDown}>
      <input
        id="search"
        type="text"
        placeholder="Search..."
        value={word}
        onChange={onChange}
        autoFocus={true}
      />
      <img
        src="assets/imgs/delete.svg"
        alt="Close Search Box.."
        onClick={(e) => close()}
      />
    </div>
  );
};

export default SearchBox;
