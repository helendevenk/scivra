export function EmbedWatermark({ id }: { id: string }) {
  return (
    <a
      href={`/gallery/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-0 left-0 right-0 h-8 bg-background/90 backdrop-blur-sm border-t flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      Powered by Scivra
    </a>
  );
}
