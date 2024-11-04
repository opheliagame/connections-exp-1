import { FreshContext } from "$fresh/server.ts";
import { getWikiPage } from "./wiki.ts";
import { DOMParser } from "@b-fuze/deno-dom";

export interface PageNode {
  id: string;
  title: string;
  content: string;
  html: string;
}

export interface PageConnection {
  id: string;
  link1: PageNode;  
  link2: PageNode;
}

/*
  params:
    - page: string
  description:
    - Parses an HTML string into an array of nodes
  returns: 
    - Array<Node>
*/
export function getNodes(page: string): Array<PageNode> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, "text/html");
  const content = doc.querySelectorAll("p");
  const nodes: Array<PageNode> = [];
  content.forEach((node, index) => {
    // const title = node.querySelector("h2")?.textContent ?? "";
    // const content = node.querySelector("p")?.textContent ?? "";
    const id = `node-${index}`;
    const title = `Node ${index}`;
    const content = node.innerText.trim();
    const html = node.innerHTML;

    if(content.length == 0) return;
    nodes.push({ id, title, content, html });
  });
  return nodes;
}

/*
  params:
    - node: Node
  description:
    - Returns an array of connections from a page node
  returns:
    - Array<PageConnection>
*/
export async function getConnections (node: PageNode) : Promise<Array<PageConnection>> {
  // const connections: Array<PageConnection> = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(node.html, "text/html");
  const docLinks = doc.querySelectorAll("a");
  const connections = await Promise.all([...docLinks].map(async (link, index) =>  {
    console.log("here")
    const id = `connection-${index}`;
    const title = link.textContent ?? "";

    const href = (link.getAttribute("href") ?? "");
    const validatedHref = href.startsWith("http") ? href : `https://en.wikipedia.org${href}`;
    console.log(validatedHref);
    const page = await getWikiPage(validatedHref);
    const nodes = await getNodes(page);
    // const content = nodes.map((node) => `${node.title}: ${node.content}`).join("\n");
    const content = nodes[0].content;
    const html = nodes[0].html;

    const newConnection = { id, link1: node, link2: { id, title, content, html } };
    return newConnection;
  }));
  // console.log(docLinks);
  // console.log(connections);
  return connections;
}

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  const searchQuery = new URL(_req.url).searchParams.get('q');
  const page = await getWikiPage(searchQuery ?? "");
  const nodes = getNodes(page);
  const result = nodes.map((node) => `${node.title}: ${node.content}`).join("\n");
  return new Response(result);
}