import {
  AIStream,
  AIStreamCallbacksAndOptions,
  AIStreamParser,
  createStreamDataTransformer,
  StreamingTextResponse,
  streamText,
} from "ai";

type InvokeRequest = {
  input: {
    input: string;
    tools: string[];
  };
  config: object;
  kwargs: object;
};

export const dynamic = "force-dynamic";

function parseLangServeStream(): AIStreamParser {
  return (data) => {
    try {
      const json = JSON.parse(data);
      // If the tool starts, return a message
      if (json.type === "on_tool_start") {
        return JSON.stringify(json.type);
      }
      // If the tool ends with on_chain_end, return the output message
      if (json.type === "on_chain_end") {
        return json.data.output.output;
      }
    } catch (e) {
      console.error("Error parsing data:", e);
      throw new Error("Error parsing data");
    }
  };
}

async function LangServeStream(
  res: Response,
  cb?: AIStreamCallbacksAndOptions
): Promise<ReadableStream> {
  const stream = AIStream(res, parseLangServeStream(), cb);

  // Create a transform stream to log the data and handle stream ending
  const loggingTransformer = new TransformStream({
    transform(chunk, controller) {
      const textChunk = new TextDecoder().decode(chunk);
      controller.enqueue(chunk); // Pass through the chunk

      if (
        textChunk.includes("Tool ended") ||
        textChunk.includes("Tool ended with error")
      ) {
        controller.terminate(); // End the stream if the tool has ended
      }
    },
  });

  return stream
    .pipeThrough(createStreamDataTransformer())
    .pipeThrough(loggingTransformer);
}

export async function POST(req: Request) {
  try {
    const { messages, host, tools, api_key, auth_enabled } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const config: object = {}; // Provide configuration as needed.
    const kwargs: object = {}; // Provide any keyword arguments as needed.

    const postData: InvokeRequest = {
      input: {
        input: lastMessage.content,
        tools: tools,
      },
      config: config,
      kwargs: kwargs,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (auth_enabled) {
      headers["x-api-key"] = api_key;
    }

    const fetchResponse = await fetch(`https://${host}/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify(postData),
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error("Failed to fetch:", errorText);
      throw new Error("Failed to invoke the API");
    }

    // Create the stream using the LangServeStream function and return it wrapped in StreamingTextResponse
    const stream = await LangServeStream(fetchResponse);
    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
