"use client";

type DeleteBlogFormProps = {
  blogId: string;
  action: (formData: FormData) => void;
};

export default function DeleteBlogForm({ blogId, action }: DeleteBlogFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm("Are you sure you want to delete this blog post?");
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input name="blog_id" type="hidden" value={blogId} />
      <button
        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
        type="submit"
      >
        Delete
      </button>
    </form>
  );
}
