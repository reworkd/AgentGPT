export const serverError = () =>
  new Response("Internal Server Error", {
    status: 500,
  });
