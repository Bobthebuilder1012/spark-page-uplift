import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, Flag, X, Pencil, Trash2, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SEED_COMMENTS,
  getViewerEligibility,
  type Comment,
  type TargetKind,
} from "@/lib/ratings-store";
import { ReportModal } from "./ReportModal";

type Props = {
  targetKind: TargetKind;
  targetId: string;
  targetName: string;
  /** Tutor viewer owns this class/profile and can post one reply per comment. */
  viewerIsOwnerTutor?: boolean;
  /** Viewer is logged in (controls report visibility). Defaults to true. */
  viewerLoggedIn?: boolean;
  /** Author id to test edit/delete affordances. Defaults to "me". */
  viewerId?: string;
  /** Active star filter from RatingBreakdown. */
  activeRatingFilter: number | null;
  onClearFilter: () => void;
};

function Avatar({ name, hue, size = 36 }: { name: string; hue: number; size?: number }) {
  const initials = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.)\s*/i, "").split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="inline-flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: size, height: size, background: `oklch(0.85 0.1 ${hue})`, color: `oklch(0.28 0.07 ${hue})`, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

const PAGE = 10;

export function CommentSection({
  targetKind,
  targetId,
  targetName,
  viewerIsOwnerTutor = false,
  viewerLoggedIn = true,
  viewerId = "me",
  activeRatingFilter,
  onClearFilter,
}: Props) {
  const eligibility = getViewerEligibility(targetKind, targetId);

  const seed = useMemo(
    () => SEED_COMMENTS.filter((c) => c.targetKind === targetKind && c.targetId === targetId),
    [targetKind, targetId],
  );
  const [comments, setComments] = useState<Comment[]>(seed);
  const [shown, setShown] = useState(PAGE);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const filtered = activeRatingFilter == null
    ? comments
    : comments.filter((c) => c.rating === activeRatingFilter);

  const visible = filtered.slice(0, shown);

  const react = (id: string, dir: "up" | "down") => {
    if (!eligibility.can_react) return;
    setComments((cs) =>
      cs.map((c) => {
        if (c.id !== id) return c;
        const prev = c.myReaction;
        let likes = c.likes, dislikes = c.dislikes;
        if (prev === "up") likes--;
        if (prev === "down") dislikes--;
        let next: "up" | "down" | null = dir;
        if (prev === dir) next = null;
        else if (dir === "up") likes++;
        else dislikes++;
        return { ...c, likes, dislikes, myReaction: next };
      }),
    );
  };

  const postComment = () => {
    if (!draft.trim()) return;
    const c: Comment = {
      id: `new-${Date.now()}`,
      targetKind, targetId,
      authorId: viewerId,
      authorName: "You",
      authorHue: 145,
      body: draft.trim(),
      createdAt: "just now",
      likes: 0, dislikes: 0,
    };
    setComments((cs) => [c, ...cs]);
    setDraft("");
    setFocused(false);
    toast.success("Comment posted");
  };

  const postReply = (commentId: string) => {
    if (!replyDraft.trim()) return;
    setComments((cs) =>
      cs.map((c) =>
        c.id === commentId
          ? {
              ...c,
              reply: {
                body: replyDraft.trim(),
                createdAt: "just now",
                tutorName: "You",
                tutorHue: 145,
              },
            }
          : c,
      ),
    );
    setReplyingId(null);
    setReplyDraft("");
    toast.success("Reply posted");
  };

  const saveEdit = (id: string) => {
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, body: editDraft.trim(), edited: true } : c)));
    setEditingId(null);
    toast.success("Comment updated");
  };

  const remove = (id: string) => {
    setComments((cs) => cs.filter((c) => c.id !== id));
    toast.success("Comment deleted");
  };

  return (
    <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold text-ink">
          Reviews & Comments <span className="text-muted-foreground font-medium">({comments.length})</span>
        </h2>
        {activeRatingFilter != null && (
          <button
            onClick={onClearFilter}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-soft text-brand-deep hover:bg-brand-soft/70"
          >
            Showing {activeRatingFilter}★ ratings only · Clear filter <X className="size-3" />
          </button>
        )}
      </header>

      {/* Write box */}
      {eligibility.can_comment && !eligibility.alreadyCommented && (
        <div className="mt-4 flex items-start gap-3">
          <Avatar name="You" hue={145} size={36} />
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onFocus={() => setFocused(true)}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Share your experience with this ${targetKind === "tutor" ? "tutor" : "class"}`}
              rows={focused ? 3 : 1}
              maxLength={1000}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand resize-none"
            />
            {focused && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{draft.length}/1000</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDraft(""); setFocused(false); }}
                    className="px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={postComment}
                    disabled={!draft.trim()}
                    className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {eligibility.can_comment && eligibility.alreadyCommented && (
        <p className="mt-4 text-sm text-muted-foreground italic">You've already shared feedback for this billing period.</p>
      )}

      {/* List */}
      <div className="mt-6 space-y-5">
        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {activeRatingFilter != null
              ? `No comments at this rating level yet.`
              : eligibility.can_comment
                ? `No comments yet. Be the first to share your experience.`
                : `No comments yet.`}
          </div>
        )}
        {visible.map((c) => {
          const isAuthor = c.authorId === viewerId;
          const reactDisabledMsg = eligibility.can_react ? undefined : `Take a class with this ${targetKind === "tutor" ? "tutor" : "class"} to react`;
          return (
            <article key={c.id} className="border-t border-border pt-5 first:border-0 first:pt-0">
              <div className="flex items-start gap-3">
                <Avatar name={c.authorName} hue={c.authorHue} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-ink">{c.authorName}</span>
                    <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                    {c.edited && (
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full" title="Edited">(edited)</span>
                    )}
                    {c.rating != null && (
                      <span className="inline-flex items-center text-[11px] font-semibold text-brand-deep bg-brand-soft px-2 py-0.5 rounded-full">{c.rating}★</span>
                    )}
                  </div>

                  {c.hiddenByMod ? (
                    <div className="mt-2 rounded-xl bg-muted/60 border border-dashed border-border p-3 flex items-center gap-2 text-sm text-muted-foreground italic">
                      <EyeOff className="size-4" /> This comment was hidden by moderators.
                    </div>
                  ) : editingId === c.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-ink">Cancel</button>
                        <button onClick={() => saveEdit(c.id)} className="px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold">Save</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-ink/90 mt-2 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                  )}

                  {/* Action bar */}
                  {!c.hiddenByMod && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => react(c.id, "up")}
                        disabled={!eligibility.can_react}
                        title={reactDisabledMsg}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition",
                          c.myReaction === "up"
                            ? "border-brand bg-brand-soft text-brand-deep"
                            : "border-border text-muted-foreground hover:border-brand/50",
                          !eligibility.can_react && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <ThumbsUp className="size-3" /> {c.likes}
                      </button>
                      <button
                        onClick={() => react(c.id, "down")}
                        disabled={!eligibility.can_react}
                        title={reactDisabledMsg}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition",
                          c.myReaction === "down"
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground hover:border-destructive/50",
                          !eligibility.can_react && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <ThumbsDown className="size-3" /> {c.dislikes}
                      </button>

                      <div className="flex-1" />

                      {viewerIsOwnerTutor && !c.reply && (
                        <button
                          onClick={() => { setReplyingId(c.id); setReplyDraft(""); }}
                          className="text-xs font-semibold text-brand-deep hover:underline"
                        >
                          Reply
                        </button>
                      )}
                      {viewerLoggedIn && !isAuthor && (
                        <button
                          onClick={() => setReportingId(c.id)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Flag className="size-3" /> Report
                        </button>
                      )}
                      {isAuthor && editingId !== c.id && (
                        <>
                          <button
                            onClick={() => { setEditingId(c.id); setEditDraft(c.body); }}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink"
                          >
                            <Pencil className="size-3" /> Edit
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Reply input */}
                  {replyingId === c.id && (
                    <div className="mt-3 ml-2 pl-3 border-l-2 border-brand-soft">
                      <textarea
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder="Write a public reply…"
                        rows={3}
                        maxLength={1000}
                        className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-brand"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setReplyingId(null)} className="px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-ink">Cancel</button>
                        <button
                          onClick={() => postReply(c.id)}
                          disabled={!replyDraft.trim()}
                          className="px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-50"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tutor reply */}
                  {c.reply && (
                    <div className="mt-4 ml-2 pl-4 border-l-2 border-brand-soft">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Avatar name={c.reply.tutorName} hue={c.reply.tutorHue} size={28} />
                        <span className="text-sm font-semibold text-ink">{c.reply.tutorName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand-soft px-1.5 py-0.5 rounded-full">Tutor</span>
                        <span className="text-xs text-muted-foreground">{c.reply.createdAt}</span>
                        {c.reply.edited && <span className="text-[10px] uppercase text-muted-foreground">(edited)</span>}
                      </div>
                      <p className="text-sm text-ink/90 mt-2 leading-relaxed">{c.reply.body}</p>
                      {viewerIsOwnerTutor && (
                        <div className="mt-2 flex gap-3">
                          <button className="text-xs text-muted-foreground hover:text-ink inline-flex items-center gap-1"><Pencil className="size-3" /> Edit</button>
                          <button
                            onClick={() => setComments((cs) => cs.map((x) => x.id === c.id ? { ...x, reply: undefined } : x))}
                            className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                          >
                            <Trash2 className="size-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Load more */}
      {shown < filtered.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShown((n) => n + PAGE)}
            className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
          >
            Load more ({filtered.length - shown})
          </button>
        </div>
      )}

      {reportingId && <ReportModal onClose={() => setReportingId(null)} />}
      {/* targetName kept for future thread heading */}
      <span className="sr-only">{targetName}</span>
    </section>
  );
}
