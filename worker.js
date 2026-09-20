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

    // / → index.html
    // /games/ → games/index.html
    if (key === "") {
      key = "index.html";
    } else if (key.endsWith("/")) {
      key += "index.html";
    }

    const object = await env.MY_BUCKET.get(key);

    // ページが存在しない場合
    if (!object) {
      const errorPage = await env.MY_BUCKET.get("404.html");

      if (!errorPage) {
        return new Response("404 Not Found", {
          status: 404
        });
      }

      const headers = new Headers();

      errorPage.writeHttpMetadata(headers);

      headers.set("Content-Type", "text/html; charset=UTF-8");

      return new Response(errorPage.body, {
        status: 404,
        headers
      });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    return new Response(object.body, {
      headers
    });
  }
};
