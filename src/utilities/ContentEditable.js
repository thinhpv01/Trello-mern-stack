export const SaveContentAfterPressEnter = (e) => {
  if (e.key === "Enter") {
    e.target.blur();
  }
};

export const selectAllInLineText = (e) => {
  e.target.focus();
  e.target.select();
  //document.execCommand("selectAll", false, null);
};
