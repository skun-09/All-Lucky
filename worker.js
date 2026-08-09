export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    let key = url.pathname;

    if (key.startsWith("/")) {
      key = key.slice(1);
    }

    try {
      key = decodeURIComponent(key);
    } catch {
      return new Response("Invalid URL", {
        status: 400
      });
    }

    if (key === "") {
      key = "index.html";
    }

    const object = await env.GAME.get(key);

    if (!object) {
      return new Response("Not Found: " + key, {
        status: 404
      });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    return new Response(object.body, {
      headers
    });
  }
};
