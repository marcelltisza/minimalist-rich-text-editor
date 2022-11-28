export function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let match, start, end;
  while ((match = regex.exec(text)) !== null) {
    start = match.index;
    end = start + match[0].length;
    callback(start, end);
  }
}
