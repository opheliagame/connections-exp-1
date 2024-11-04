import { type Signal, signal, useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import {
  getConnections,
  PageConnection,
  PageNode,
} from "../routes/api/node.ts";
import { Handlers } from "$fresh/server.ts";

interface NodeCardProps {
  nodes: Array<PageNode>;
  // connections: Array<PageConnection>;
}

// export const handler: Handlers<NodeCardProps> = {
//   async GET(req, ctx) {
//     const connections = await getConnections();
//     return ctx.render({ nodes: [], connections: [] });
//   },
// };

export default function NodeCard(props: NodeCardProps) {
  const currentNode = useSignal(props.nodes.length > 0 ? props.nodes[0] : null);
  const currentConnections = useSignal<PageConnection[] | null>(null);

  async function setConnections() {
    if (currentNode.value == null) return;
    const connections = await getConnections(currentNode.value);
    currentConnections.value = connections;
  }

  async function goForward() {
    const randomIndex = Math.floor(Math.random() * props.nodes.length);
    currentNode.value = props.nodes[randomIndex];

    currentConnections.value = null;
    await setConnections();
  }

  async function onClickConnection(connection: PageConnection) {
    currentNode.value = connection.link2;
    currentConnections.value = null;
    await setConnections();
  }

  if (currentNode.value == null) {
    return <></>;
  }

  return (
    <div class="w-full h-full relative">
      <div class="absolute bottom-0 w-full">
        <div class="flex flex-row justify-between">
          <Button onClick={() => null}>
            <svg
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 17L8 12L16 7V17Z" fill="magenta" />
            </svg>
          </Button>

          <Button onClick={() => goForward()}>
            <svg
              class="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 7L16 12L8 17V7Z" fill="magenta" />
            </svg>
          </Button>
        </div>
      </div>

      {/* <p>{currentNode.value?.content}</p> */}

      {/* {currentNode.value != null && ( */}
      <div class="h-full flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        <div class="text-sm">
          {/* <h2>{currentNode.value?.title}</h2> */}
          <p>{currentNode.value?.content}</p>
        </div>
        {/* )} */}

        {
          /* <h1>connections</h1>
      <h2>{currentConnections.value.length}</h2>
      <p>{currentConnections.value.map((v) => v.link2.content).join(", ")}</p> */
        }

        {currentConnections.value != null &&
          currentConnections.value.length > 0 && (
          <div class="">
            <h1 class="italic text-base">connections</h1>
            {currentConnections.value.map((connection) => (
              <div
                class="text-sm border border-dashed"
                onClick={() => onClickConnection(connection)}
              >
                {/* <h2>{connection.link2.title}</h2> */}
                <p class="w-full h-8 text-ellipsis overflow-hidden whitespace-nowrap">
                  {connection.link2.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
