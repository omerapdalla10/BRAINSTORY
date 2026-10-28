type PostCoverProps = {
  title: string;
  imageUrl: string | null;
};

/** Fills its (relative) parent with the cover image, or a branded tile when there is none. */
export default function PostCover({ title, imageUrl }: PostCoverProps) {
  if (!imageUrl) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary to-[#05506b]">
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-accent/20" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
        <span className="material-symbols-outlined relative text-5xl text-white/80">auto_stories</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      src={imageUrl}
    />
  );
}
