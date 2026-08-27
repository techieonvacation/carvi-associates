type RawHtmlProps = {
  html: string;
};

export function RawHtml({ html }: RawHtmlProps) {
  const trimmed = html.trim();
  if (!trimmed) return null;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: trimmed }} />;
}
