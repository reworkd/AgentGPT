export const get_avatar = (user?: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) =>
  user?.image ||
  "https://avatar.vercel.sh/" +
    (user?.email || "") +
    ".svg?text=" +
    (user?.name?.substr(0, 2).toUpperCase() || "");
