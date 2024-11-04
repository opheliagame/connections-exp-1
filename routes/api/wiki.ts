import { FreshContext } from "$fresh/server.ts";
import { DOMParser } from "@b-fuze/deno-dom";
/*
  params: 
    - searchQuery: string
  description:
    - Returns a wikipedia page based on the search query
  returns:
    - string
*/
export async function getWikiPageBySearchQuery(searchQuery: string) : Promise<string> {
  const pageUrl = `https://en.wikipedia.org/wiki/${searchQuery}`;
  return (await getWikiPage(pageUrl));
}

export async function getWikiPage(pageUrl: string) : Promise<string> {
  const response = await fetch(pageUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const content = doc.querySelector("#mw-content-text");
  return content?.innerHTML ?? "";
}


export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  const searchQuery = new URL(_req.url).searchParams.get('q');
  if (!searchQuery) {
    return new Response('Please provide a search query');
  }
  const body = await getWikiPageBySearchQuery(searchQuery)
  return new Response(body);
};