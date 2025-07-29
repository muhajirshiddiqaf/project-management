// ==============================|| HIGHLIGHT TEXT UTILITY ||============================== //

export const highlightText = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
        {part}
      </span>
    ) : part
  );
};

export const highlightTextString = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
