import Together from 'together-ai';


export async function GET() {
  const together = new Together({
    apiKey: "afbdab26abf0f0e4fd71b1f0813e4f7277d3ecc171e82590ddafcff81453e0b5"
  });

  const chat = await together.chat.completions.create({
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    messages: [{ role: 'user', content: 'Top 3 things to do in New York?' }],
  });



  return Response.json({
    message: "Hello, World! This is a simple API endpoint.",
    chat,
  });
}
