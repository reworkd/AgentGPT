import axios from "axios";
import cheerio from "cheerio";

interface Metadata {
  title?: string;
  hostname?: string;
  favicon?: string;
}

const extractMetadata = async (url: string) => {
  try {
    const res = await axios.get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
      },
    });
    const html = res.data;
    const $ = cheerio.load(html);
    const metadata: Metadata = {};
    const urlObj = new URL(url);

    metadata.hostname = urlObj.hostname;
    metadata.title = $("title").text().trim();
    //extract favicon
    $("link").each((index, link) => {
      if (link.attribs.rel == "icon" || link.attribs.rel == "shortcut icon") {
        let favicon: string = (
          link.attribs.href?.startsWith("//")
            ? link.attribs.href?.substring(2)
            : link.attribs.href
        ) as string;
        if (!isValidUrl(favicon)) {
          favicon = `${urlObj.origin}${favicon}`;
        }
        metadata.favicon = favicon || `${urlObj.origin}/favicon.ico`;
      }
    });
    return metadata;
  } catch (error) {
    const urlObj = new URL(url);
    const metadata: Metadata = {
      hostname: urlObj.hostname,
      favicon: `${urlObj.origin}/favicon.ico`,
    };
    return metadata;
  }
};

const isValidUrl = (url: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?",
    "i"
  );
  return !!urlPattern.test(url) as boolean;
};

export default extractMetadata;
