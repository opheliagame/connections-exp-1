import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import Header from "../components/Header.tsx";
import NodeCard from "../islands/node-card.tsx";
import {
  getConnections,
  getNodes,
  PageConnection,
  PageNode,
} from "./api/node.ts";
import { getWikiPage, getWikiPageBySearchQuery } from "./api/wiki.ts";

interface Data {
  query: string;
  nodes: Array<PageNode>;
  // connections: Array<PageConnection>;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const query = new URL(req.url).searchParams.get("q");
    if (!query) {
      return ctx.render({ query: "", nodes: [] });
    }
    const page = await getWikiPageBySearchQuery(query);
    const nodes = await getNodes(page);
    // const connections = (await Promise.all(nodes.map((node) => getConnections(node)))).flat();
    // const connections = await getConnections(nodes[0]);
    return ctx.render({ query, nodes });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { query, nodes } = data;


  return (
    <div class="h-screen px-4 py-2 mx-auto">
      <Header title={query} />

      <div class="max-w-screen-md h-full mx-auto flex flex-col gap-2 items-center justify-center">
        {query === "" &&
          (
            <>
              <form class="flex flex-row justify-center gap-2 items-center">
                <input class="h-full rounded-full border border-fuchsia-600 hover:border-fuchsia-600 px-2 py-1" type="text" name="q" value={query} />
                <button class="px-2 py-1 rounded-full border border-fuchsia-600 bg-white text-fuchsia-600 " type="submit">search</button>
              </form>
              
              <h1 class="text-gray-700 text-sm">what would you like to explore</h1>
            </>
          )}

        {/* {query && (
          <h1 class="text-base italic">
            currently exploring <span class="uppercase text-md font-bold">{query}</span>
          </h1>
        )} */}

        <NodeCard nodes={nodes} />
        
      </div>
    </div>
  );
}


// {nodes.length > 0 &&
//   (
//     <div class="w-full h-full">
//       <h1>Explorer</h1>
//       <div class="flex flex-row w-full h-full">
//         {nodes.slice(0, 10).map((node) => (
//           <div class="flex-none basis-full">
//             {/* <h2>{node.title}</h2> */}
//             <p>{node.content}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )}

// {connections.length > 0 &&
//   (
//     <div>
//       <h1>Connections</h1>
//       {connections.map((connection) => (
//         <div>
//           <h2>{connection.link1.title} - {connection.link2.title}</h2>
//           <p>{connection.link2.content}</p>
//         </div>
//       ))}
//     </div>
//   )}