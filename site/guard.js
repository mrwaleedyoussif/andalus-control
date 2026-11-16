// Refuses to run inside another site's frame.
if (window.top !== window.self) { document.documentElement.hidden = true; throw new Error("framed"); }
