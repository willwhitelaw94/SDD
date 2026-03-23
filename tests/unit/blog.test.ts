import { describe, it, expect } from "vitest";
import { getBlogPosts, getBlogPost } from "@/lib/blog";

describe("blog", () => {
  it("returns blog posts", () => {
    const posts = getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it("every post has required fields", () => {
    const posts = getBlogPosts();
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(typeof post.content).toBe("string");
      expect(post.content.length).toBeGreaterThan(0);
    }
  });

  it("posts are sorted newest first", () => {
    const posts = getBlogPosts();
    for (let i = 1; i < posts.length; i++) {
      if (posts[i].date && posts[i - 1].date) {
        expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
          new Date(posts[i].date).getTime()
        );
      }
    }
  });

  it("getBlogPost resolves a known post", () => {
    const posts = getBlogPosts();
    const first = posts[0];
    const post = getBlogPost(first.slug);
    expect(post).toBeDefined();
    expect(post!.slug).toBe(first.slug);
    expect(post!.title).toBe(first.title);
  });

  it("getBlogPost returns undefined for missing slug", () => {
    const post = getBlogPost("this-post-does-not-exist");
    expect(post).toBeUndefined();
  });
});
